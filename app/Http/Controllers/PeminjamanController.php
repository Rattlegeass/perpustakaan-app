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
            'buku_ids' => 'required|array|min:1',
            'buku_ids.*' => 'exists:bukus,id',
            'batas_tgl_peminjaman' => 'required|date|after_or_equal:today',
            'user_id' => 'required|exists:users,id',
        ]);

        // Check stok for all books
        foreach ($request->buku_ids as $bukuId) {
            $buku = Buku::find($bukuId);
            if ($buku->stok <= 0) {
                return back()->withErrors(['buku_ids' => 'Stok buku "' . $buku->judul . '" tidak tersedia']);
            }
        }

        // Create peminjaman (AUTO-APPROVED, langsung dipinjam)
        $peminjaman = Peminjaman::create([
            'user_id' => $request->user_id,
            'tgl_peminjaman' => now(),
            'batas_tgl_peminjaman' => $request->batas_tgl_peminjaman,
            'status_peminjaman' => 'dipinjam',
        ]);

        // Create detail peminjaman and decrement stok for each book
        foreach ($request->buku_ids as $bukuId) {
            DetailPeminjaman::create([
                'peminjaman_id' => $peminjaman->id,
                'buku_id' => $bukuId,
                'status_buku' => 'dipinjam',
            ]);

            Buku::find($bukuId)->decrement('stok');
        }

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
            'returns' => 'required|array|min:1',
            'returns.*.detail_peminjaman_id' => 'required|exists:detail_peminjamans,id',
            'returns.*.catatan_kondisi' => 'nullable|string',
        ]);

        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) {
            return back()->withErrors(['error' => 'Peminjaman tidak ditemukan']);
        }

        $totalDenda = 0;
        $totalHariTerlambat = 0;
        $returnedBooksInfo = [];
        $hasLate = false;

        foreach ($request->returns as $ret) {
            $detail = DetailPeminjaman::find($ret['detail_peminjaman_id']);
            if (!$detail || $detail->peminjaman_id !== $peminjaman->id) {
                continue;
            }

            // Skip jika sudah pernah dikembalikan
            if ($detail->status_buku === 'dikembalikan') {
                continue;
            }

            // Update detail peminjaman dengan info pengembalian
            $detail->update([
                'tgl_pengembalian' => now()->toDateString(),
                'status_buku' => 'dikembalikan',
                'catatan_kondisi' => $ret['catatan_kondisi'] ?? null,
            ]);

            // Increment stok buku
            $buku = Buku::find($detail->buku_id);
            if ($buku) {
                $buku->increment('stok');
                $returnedBooksInfo[] = $buku->judul;
            }

            // Hitung denda jika terlambat
            $dueDateCarbon = Carbon::parse($peminjaman->batas_tgl_peminjaman)->startOfDay();
            $returnDateCarbon = Carbon::now()->startOfDay();
            $isLate = $returnDateCarbon->greaterThan($dueDateCarbon);

            if ($isLate) {
                $hariTerlambat = (int) abs($returnDateCarbon->diffInDays($dueDateCarbon));
                $tarifDenda = 5000; // Rp 5000 per hari
                $dendaBuku = $hariTerlambat * $tarifDenda;
                
                $totalDenda += $dendaBuku;
                $totalHariTerlambat = max($totalHariTerlambat, $hariTerlambat);
                $hasLate = true;

                Denda::create([
                    'detail_peminjaman_id' => $detail->id,
                    'jumlah_hari_terlambat' => $hariTerlambat,
                    'jumlah_denda' => $dendaBuku,
                    'status_pembayaran' => 'belum_bayar',
                ]);
            }
        }

        // Cek apakah semua buku dalam peminjaman ini telah dikembalikan
        $allReturned = !$peminjaman->detailPeminjaman()->where('status_buku', 'dipinjam')->exists();

        if ($allReturned) {
            $peminjaman->update([
                'status_peminjaman' => 'dikembalikan',
            ]);
        } else {
            if ($hasLate) {
                $peminjaman->update([
                    'status_peminjaman' => 'terlambat',
                ]);
            }
        }

        // Regenerate struk menggunakan StrukController agar data terupdate secara real-time
        app(StrukController::class)->generate($peminjaman);

        $bukuTitles = implode(', ', $returnedBooksInfo);

        if ($hasLate) {
            return redirect('/peminjamans')->with([
                'success' => 'Buku "' . $bukuTitles . '" berhasil dikembalikan. Total denda Rp' . number_format($totalDenda) . ' karena terlambat.',
                'notification' => [
                    'type' => 'warning',
                    'title' => '⏰ Denda Terlambat',
                    'message' => 'Dikenai denda Rp ' . number_format($totalDenda) . ' untuk pengembalian buku yang terlambat.'
                ]
            ]);
        }

        return redirect('/peminjamans')->with([
            'success' => 'Buku "' . $bukuTitles . '" berhasil dikembalikan tepat waktu.',
            'notification' => [
                'type' => 'success',
                'title' => '✅ Buku Dikembalikan',
                'message' => 'Buku "' . $bukuTitles . '" dikembalikan tepat waktu.'
            ]
        ]);
    }

    public function destroy(string $id)
    {
        $peminjaman = Peminjaman::with('detailPeminjaman')->find($id);

        if (!$peminjaman) {
            return redirect('/peminjamans')->with('error', 'Peminjaman tidak ditemukan');
        }

        if ($peminjaman->status_peminjaman === 'dipinjam' || $peminjaman->status_peminjaman === 'terlambat') {
            // Kembalikan stok buku jika peminjaman masih dipinjam / terlambat
            foreach ($peminjaman->detailPeminjaman as $detail) {
                if ($detail->status_buku === 'dipinjam') {
                    $buku = Buku::find($detail->buku_id);
                    if ($buku) {
                        $buku->increment('stok');
                    }
                }
            }
        }

        $peminjaman->delete();

        return redirect('/peminjamans')->with('success', 'Peminjaman berhasil dihapus');
    }

    /**
     * Approve pending peminjaman dari member (ubah status menjadi menunggu_pengambilan)
     * Buku disiapkan & menunggu member ambil
     * 
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve(string $id)
    {
        $peminjaman = Peminjaman::with('detailPeminjaman.buku')->find($id);

        if (!$peminjaman) {
            return back()->with('error', 'Peminjaman tidak ditemukan');
        }

        // Check apakah status menunggu_persetujuan
        if ($peminjaman->status_peminjaman !== 'menunggu_persetujuan') {
            return back()->with('error', 'Hanya peminjaman yang menunggu persetujuan yang dapat disetujui');
        }

        // Update peminjaman status ke menunggu_pengambilan (belum set tanggal, belum decrement stok)
        $peminjaman->update([
            'status_peminjaman' => 'menunggu_pengambilan',
        ]);

        // Generate struk
        app(StrukController::class)->generate($peminjaman);

        // Get buku name for notification
        $bukuNames = $peminjaman->detailPeminjaman->map(fn($d) => $d->buku->judul)->join(', ');

        return back()->with([
            'success' => 'Peminjaman disetujui! Buku siap untuk diambil member.',
            'notification' => [
                'type' => 'success',
                'title' => '✅ Peminjaman Disetujui',
                'message' => 'Buku "' . $bukuNames . '" siap diambil oleh ' . $peminjaman->user->name
            ]
        ]);
    }

    /**
     * Confirm member pickup - ubah status menunggu_pengambilan -> dipinjam
     * Set tgl_peminjaman & deadline +7 hari, decrement stok, generate struk
     * 
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function confirmPickup(string $id)
    {
        $peminjaman = Peminjaman::with('detailPeminjaman.buku')->find($id);

        if (!$peminjaman) {
            return back()->with('error', 'Peminjaman tidak ditemukan');
        }

        // Check apakah status menunggu_pengambilan
        if ($peminjaman->status_peminjaman !== 'menunggu_pengambilan') {
            return back()->with('error', 'Hanya peminjaman yang menunggu pengambilan yang dapat dikonfirmasi');
        }

        // Set tanggal peminjaman = hari ini
        $tglPeminjaman = now()->toDateString();
        $batasTgl = now()->addDays(7)->toDateString();

        // Update peminjaman: set tgl_peminjaman & deadline, ubah status ke dipinjam
        $peminjaman->update([
            'tgl_peminjaman' => $tglPeminjaman,
            'batas_tgl_peminjaman' => $batasTgl,
            'status_peminjaman' => 'dipinjam',
        ]);

        // Decrement stok buku untuk setiap detail peminjaman
        foreach ($peminjaman->detailPeminjaman as $detail) {
            $buku = Buku::find($detail->buku_id);
            if ($buku && $buku->stok > 0) {
                $buku->decrement('stok');
            }
        }

        // Generate struk
        app(StrukController::class)->generate($peminjaman);

        // Get buku name for notification
        $bukuNames = $peminjaman->detailPeminjaman->map(fn($d) => $d->buku->judul)->join(', ');

        return back()->with([
            'success' => 'Peminjaman dimulai! Deadline: ' . $batasTgl,
            'notification' => [
                'type' => 'success',
                'title' => '📖 Peminjaman Dimulai',
                'message' => 'Member ' . $peminjaman->user->name . ' telah mengambil buku "' . $bukuNames . '". Deadline: ' . \Carbon\Carbon::parse($batasTgl)->format('d-m-Y')
            ]
        ]);
    }

    // MEMBER VIEWS
    public function memberIndex(Request $request)
    {
        $userId = Auth::id();
        $peminjamans = Peminjaman::with(['detailPeminjaman.buku', 'detailPeminjaman.dendas', 'struk'])
            ->where('user_id', $userId)
            ->when($request->search, function ($query) use ($request) {
                $query->where('tgl_peminjaman', 'like', '%' . $request->search . '%')
                    ->orWhere('status_peminjaman', 'like', '%' . $request->search . '%')
                    ->orWhereHas('detailPeminjaman.buku', function ($q) use ($request) {
                        $q->where('judul', 'like', '%' . $request->search . '%');
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Peminjamans/IndexMember', [
            'peminjamans' => $peminjamans,
            'filters' => $request->only('search')
        ]);
    }

    public function memberStore(Request $request)
    {
        $request->validate([
            'buku_ids' => 'required|array|min:1',
            'buku_ids.*' => 'exists:bukus,id',
        ]);

        // Check stok for all books
        $judulBukus = [];
        foreach ($request->buku_ids as $bukuId) {
            $buku = Buku::find($bukuId);
            if ($buku->stok <= 0) {
                return back()->withErrors(['buku_ids' => 'Stok buku "' . $buku->judul . '" tidak tersedia']);
            }
            $judulBukus[] = $buku->judul;
        }

        // Create peminjaman dengan status menunggu_persetujuan (PENDING ADMIN APPROVAL)
        // Note: batas_tgl_peminjaman diset NULL karena akan ditentukan setelah admin approve
        $peminjaman = Peminjaman::create([
            'user_id' => Auth::id(),
            'tgl_peminjaman' => now(),
            'batas_tgl_peminjaman' => null,  // Will be set when admin approves
            'status_peminjaman' => 'menunggu_persetujuan',
        ]);

        // Create detail peminjaman for each book
        foreach ($request->buku_ids as $bukuId) {
            DetailPeminjaman::create([
                'peminjaman_id' => $peminjaman->id,
                'buku_id' => $bukuId,
                'status_buku' => 'dipinjam',
            ]);
        }

        $bukuNames = implode(', ', $judulBukus);

        return redirect('/peminjamans-saya')->with([
            'success' => 'Permintaan peminjaman berhasil dikirim! Menunggu persetujuan admin.',
            'notification' => [
                'type' => 'info',
                'title' => '⏳ Menunggu Persetujuan',
                'message' => 'Admin akan segera mengkonfirmasi permintaan peminjaman Anda untuk buku "' . $bukuNames . '"'
            ]
        ]);
    }

    public function memberCancel(string $id)
    {
        $peminjaman = Peminjaman::with('detailPeminjaman')->find($id);
        $userId = Auth::id();

        if (!$peminjaman || $peminjaman->user_id !== $userId) {
            return back()->withErrors('Peminjaman tidak ditemukan');
        }

        if (!in_array($peminjaman->status_peminjaman, ['menunggu_persetujuan', 'menunggu_pengambilan'])) {
            return back()->withErrors('Hanya peminjaman yang menunggu persetujuan atau pengambilan yang dapat dibatalkan');
        }

        // Delete peminjaman (no stock increment needed since stock is only decremented on confirmPickup)
        $peminjaman->delete();

        return redirect('/peminjamans-saya')->with('success', 'Peminjaman berhasil dibatalkan');
    }

    public function memberDendas()
    {
        $userId = Auth::id();
        $dendas = Denda::whereHas('detailPeminjaman.peminjaman', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->with(['detailPeminjaman.buku', 'detailPeminjaman.peminjaman'])
        ->latest()
        ->paginate(10);

        return Inertia::render('Dendas/Index', [
            'dendas' => $dendas
        ]);
    }

    public function adminDendas(Request $request)
    {
        $dendas = Denda::with(['detailPeminjaman.buku', 'detailPeminjaman.peminjaman.user'])
            ->when($request->search, function ($query) use ($request) {
                $query->whereHas('detailPeminjaman.buku', function ($q) use ($request) {
                    $q->where('judul', 'like', '%' . $request->search . '%');
                })
                ->orWhereHas('detailPeminjaman.peminjaman.user', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->status, function ($query) use ($request) {
                if ($request->status !== 'all' && in_array($request->status, ['belum_bayar', 'lunas'])) {
                    $query->where('status_pembayaran', $request->status);
                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dendas/AdminIndex', [
            'dendas' => $dendas,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function bayarDenda(string $id)
    {
        $denda = Denda::with('detailPeminjaman.buku')->find($id);
        if (!$denda) {
            return back()->with('error', 'Denda tidak ditemukan');
        }

        $denda->update([
            'status_pembayaran' => 'lunas',
        ]);

        // Regenerasi struk agar data denda terupdate
        $detailPeminjaman = $denda->detailPeminjaman;
        if ($detailPeminjaman && $detailPeminjaman->peminjaman_id) {
            $peminjaman = Peminjaman::find($detailPeminjaman->peminjaman_id);
            if ($peminjaman) {
                app(StrukController::class)->generate($peminjaman);
            }
        }

        return back()->with([
            'success' => 'Pembayaran denda berhasil dikonfirmasi!',
            'notification' => [
                'type' => 'success',
                'title' => '💰 Denda Lunas',
                'message' => 'Status pembayaran denda untuk buku "' . ($denda->detailPeminjaman->buku->judul ?? 'Buku') . '" telah diubah menjadi lunas.'
            ]
        ]);
    }
}

