<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Peminjaman;
use App\Models\Buku;
use App\Models\DetailPeminjaman;
use App\Models\Denda;
use App\Models\Struk;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Http\Controllers\StrukController;

class PeminjamanController extends Controller
{
    public function index(Request $request)
    {
        $peminjamans = Peminjaman::with(['user', 'detailPeminjaman.buku', 'struk'])
            ->when($request->search, function ($query) use ($request) {
                $query->where('tgl_peminjaman', 'like', '%' . $request->search . '%')
                    ->orWhere('batas_tgl_peminjaman', 'like', '%' . $request->search . '%')
                    ->orWhere('status_peminjaman', 'like', '%' . $request->search . '%')
                    ->orWhereHas('user', function ($q) use ($request) {
                        $q->where('name', 'like', '%' . $request->search . '%');
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Peminjamans/Index', [
            'peminjamans' => $peminjamans,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        $bukus = Buku::where('stok', '>', 0)->get();
        $users = \App\Models\User::where('role', 'member')->get();

        return Inertia::render('Peminjamans/Create', [
            'bukus' => $bukus,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'buku_id' => 'required|exists:bukus,id',
            'batas_tgl_peminjaman' => 'required|date|after_or_equal:today',
            'user_id' => 'required|exists:users,id',
        ]);

        // Check stok
        $buku = Buku::find($request->buku_id);
        if ($buku->stok <= 0) {
            return back()->withErrors(['buku_id' => 'Stok buku tidak tersedia']);
        }

        // Create peminjaman (AUTO-APPROVED, langsung dipinjam)
        $peminjaman = Peminjaman::create([
            'user_id' => $request->user_id,
            'tgl_peminjaman' => now(),
            'batas_tgl_peminjaman' => $request->batas_tgl_peminjaman,
            'status_peminjaman' => 'dipinjam',
        ]);

        // Create detail peminjaman
        DetailPeminjaman::create([
            'peminjaman_id' => $peminjaman->id,
            'buku_id' => $request->buku_id,
            'status_buku' => 'dipinjam',
        ]);

        // Decrement stok buku
        $buku->decrement('stok');

        // Generate struk menggunakan StrukController
        app(StrukController::class)->generate($peminjaman);

        return redirect('/peminjamans')->with('success', 'Peminjaman berhasil dibuat dan auto-approved!');
    }

    public function show(string $id)
    {
        $peminjaman = Peminjaman::with([
            'user',
            'detailPeminjaman.buku',
            'struk',
            'detailPeminjaman.dendas'
        ])->find($id);

        if (!$peminjaman) {
            return redirect('/peminjamans')->with('error', 'Peminjaman tidak ditemukan');
        }

        return Inertia::render('Peminjamans/Show', [
            'peminjaman' => $peminjaman
        ]);
    }

    public function edit(string $id)
    {
        $peminjaman = Peminjaman::with(['user', 'detailPeminjaman.buku'])->find($id);

        if (!$peminjaman) {
            return redirect('/peminjamans')->with('error', 'Peminjaman tidak ditemukan');
        }

        if ($peminjaman->status_peminjaman === 'dikembalikan') {
            return redirect('/peminjamans')->with('error', 'Peminjaman sudah dikembalikan');
        }

        return Inertia::render('Peminjamans/Edit', [
            'peminjaman' => $peminjaman
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'detail_peminjaman_id' => 'required|exists:detail_peminjamans,id',
            'catatan_kondisi' => 'nullable|string',
        ]);

        $detail = DetailPeminjaman::find($request->detail_peminjaman_id);
        $peminjaman = $detail->peminjaman;

        if (!$detail) {
            return back()->withErrors(['detail_peminjaman_id' => 'Detail peminjaman tidak ditemukan']);
        }

        // Update detail peminjaman with return info
        $detail->update([
            'tgl_pengembalian' => now()->toDateString(),
            'status_buku' => 'dikembalikan',
            'catatan_kondisi' => $request->catatan_kondisi,
        ]);

        // Increment stok buku
        $buku = Buku::find($detail->buku_id);
        if ($buku) {
            $buku->increment('stok');
        }

        // Update peminjaman status
        $peminjaman->update([
            'status_peminjaman' => 'dikembalikan',
        ]);

        // Check if late and create fine
        $dueDateCarbon = Carbon::parse($peminjaman->batas_tgl_peminjaman);
        $returnDateCarbon = Carbon::now();

        if ($returnDateCarbon->isAfter($dueDateCarbon)) {
            $hariTerlambat = $returnDateCarbon->diffInDays($dueDateCarbon);
            $tarifDenda = 5000; // Rp 5000 per hari
            $totalDenda = $hariTerlambat * $tarifDenda;

            Denda::create([
                'detail_peminjaman_id' => $detail->id,
                'jumlah_hari_terlambat' => $hariTerlambat,
                'total_denda' => $totalDenda,
                'status_pembayaran' => 'belum_bayar',
            ]);

            // Update status ke terlambat
            $peminjaman->update([
                'status_peminjaman' => 'terlambat',
            ]);

            return redirect('/peminjamans')->with('success', 'Buku berhasil dikembalikan. Denda Rp' . number_format($totalDenda) . ' karena terlambat ' . $hariTerlambat . ' hari.');
        }

        return redirect('/peminjamans')->with('success', 'Buku berhasil dikembalikan tanpa denda');
    }

    public function destroy(string $id)
    {
        $peminjaman = Peminjaman::with('detailPeminjaman')->find($id);

        if (!$peminjaman) {
            return redirect('/peminjamans')->with('error', 'Peminjaman tidak ditemukan');
        }

        if ($peminjaman->status_peminjaman === 'dipinjam') {
            // Kembalikan stok buku jika peminjaman masih dipinjam
            foreach ($peminjaman->detailPeminjaman as $detail) {
                $buku = Buku::find($detail->buku_id);
                if ($buku) {
                    $buku->increment('stok');
                }
            }
        }

        $peminjaman->delete();

        return redirect('/peminjamans')->with('success', 'Peminjaman berhasil dihapus');
    }
}
