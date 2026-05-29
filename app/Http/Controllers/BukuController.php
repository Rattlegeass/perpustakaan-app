<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Buku;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage; // Tambahkan ini untuk mengelola file gambar

class BukuController extends Controller
{
    public function index(Request $request)
    {
        $bukus = Buku::query()->when($request->search, function ($query) use ($request) {
            $query->where('judul', 'like', '%' . $request->search . '%')
                ->orWhere('penulis', 'like', '%' . $request->search . '%');
        })->latest()->paginate(5)->withQueryString();

        return Inertia::render('Bukus/Index', [
            'bukus' => $bukus,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        return Inertia::render('Bukus/Create');
    }

    public function store(Request $request)
    {
        // 1. Tambahkan validasi untuk cover (opsional, harus berupa gambar, maksimal 2MB)
        $request->validate([
            'judul' => 'required',
            'penulis' => 'required',
            'penerbit' => 'required',
            'tahun_terbit' => 'required',
            'stok' => 'required|integer',
            'kategori' => 'required',
            'sinopsis' => 'required',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg|max:5120', 
        ]);

        // 2. Logika menyimpan gambar
        $coverPath = null;
        if ($request->hasFile('cover')) {
            // Simpan gambar ke folder storage/app/public/covers
            $path = $request->file('cover')->store('covers', 'public');
            // Buat URL yang bisa diakses langsung oleh React
            $coverPath = '/storage/' . $path;
        }

        // 3. Masukkan ke database
        Buku::create([
            'judul' => $request->judul,
            'penulis' => $request->penulis,
            'penerbit' => $request->penerbit,
            'tahun_terbit' => $request->tahun_terbit,
            'stok' => $request->stok,
            'kategori' => $request->kategori,
            'sinopsis' => $request->sinopsis,
            'cover' => $coverPath, // Simpan path cover-nya
        ]);

        return redirect('/bukus');
    }

    public function show(string $id)
    {
        $buku = Buku::find($id);

        if (!$buku) {
            return redirect('/bukus')->with('error', 'Buku tidak ditemukan');
        }

        return Inertia::render('Bukus/Show', [
            'buku' => $buku
        ]);
    }

    public function edit(Buku $buku)
    {
        return Inertia::render('Bukus/Edit', [
            'buku' => $buku
        ]);
    }

    public function update(Request $request, Buku $buku)
    {
        // 1. Tambahkan validasi cover di update
        $request->validate([
            'judul' => 'required',
            'penulis' => 'required',
            'penerbit' => 'required',
            'tahun_terbit' => 'required',
            'stok' => 'required|integer',
            'kategori' => 'required',
            'sinopsis' => 'required',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // 2. Ambil path cover lama sebagai default
        $coverPath = $buku->cover;

        // 3. Jika ada file cover baru yang diupload
        if ($request->hasFile('cover')) {
            // Hapus gambar lama jika ada di penyimpanan lokal
            if ($buku->cover && str_starts_with($buku->cover, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $buku->cover);
                Storage::disk('public')->delete($oldPath);
            }

            // Simpan gambar baru
            $path = $request->file('cover')->store('covers', 'public');
            $coverPath = '/storage/' . $path;
        }

        // 4. Update data ke database
        $buku->update([
            'judul' => $request->judul,
            'penulis' => $request->penulis,
            'penerbit' => $request->penerbit,
            'tahun_terbit' => $request->tahun_terbit,
            'stok' => $request->stok,
            'kategori' => $request->kategori,
            'sinopsis' => $request->sinopsis,
            'cover' => $coverPath, // Simpan cover yang sudah diperbarui
        ]);

        return redirect('/bukus');
    }

    public function destroy(Buku $buku)
    {
        // Hapus file gambar dari storage sebelum menghapus data bukunya
        if ($buku->cover && str_starts_with($buku->cover, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $buku->cover);
            Storage::disk('public')->delete($oldPath);
        }

        $buku->delete();

        return redirect('/bukus');
    }

    // MEMBER CATALOG VIEW
    public function memberIndex(Request $request)
    {
        $bukus = Buku::query()
            ->when($request->search, function ($query) use ($request) {
                $query->where('judul', 'like', '%' . $request->search . '%')
                    ->orWhere('penulis', 'like', '%' . $request->search . '%')
                    ->orWhere('sinopsis', 'like', '%' . $request->search . '%');
            })
            ->when($request->kategori, function ($query) use ($request) {
                $query->where('kategori', $request->kategori);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Bukus/IndexMember', [
            'bukus' => $bukus,
            'filters' => $request->only(['search', 'kategori']),
            'categories' => ['fiksi', 'non-fiksi']
        ]);
    }
}