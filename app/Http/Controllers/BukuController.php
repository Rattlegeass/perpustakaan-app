<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Buku;
use Inertia\Inertia;

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
        $request->validate([
            'judul' => 'required',
            'penulis' => 'required',
            'penerbit' => 'required',
            'tahun_terbit' => 'required',
            'stok' => 'required|integer',
            'kategori' => 'required',
        ]);

        Buku::create([
            'judul' => $request->judul,
            'penulis' => $request->penulis,
            'penerbit' => $request->penerbit,
            'tahun_terbit' => $request->tahun_terbit,
            'stok' => $request->stok,
            'kategori' => $request->kategori,
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
        $request->validate([
            'judul' => 'required',
            'penulis' => 'required',
            'penerbit' => 'required',
            'tahun_terbit' => 'required',
            'stok' => 'required|integer',
            'kategori' => 'required',
        ]);

        $buku->update([
            'judul' => $request->judul,
            'penulis' => $request->penulis,
            'penerbit' => $request->penerbit,
            'tahun_terbit' => $request->tahun_terbit,
            'stok' => $request->stok,
            'kategori' => $request->kategori,
        ]);

        return redirect('/bukus');
    }

    public function destroy(Buku $buku)
    {
        $buku->delete();

        return redirect('/bukus');
    }
}
