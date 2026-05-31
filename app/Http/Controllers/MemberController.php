<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $members = User::where('role', 'member')
            ->withCount('peminjamans')
            ->when($request->search, function ($query) use ($request) {
                $query->where(function($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%')
                      ->orWhere('no_telp', 'like', '%' . $request->search . '%')
                      ->orWhere('no_identitas', 'like', '%' . $request->search . '%');
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Members/Index', [
            'members' => $members,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        return Inertia::render('Members/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'no_telp' => 'nullable|string|max:20',
            'no_identitas' => 'nullable|string|max:50',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('avatars', 'public');
            $fotoPath = '/storage/' . $path;
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'no_telp' => $request->no_telp,
            'no_identitas' => $request->no_identitas,
            'foto' => $fotoPath,
            'role' => 'member',
        ]);

        return redirect()->route('members.index')->with([
            'success' => 'Anggota baru berhasil didaftarkan!',
            'notification' => [
                'type' => 'success',
                'title' => '👥 Anggota Didaftarkan',
                'message' => 'Anggota bernama ' . $request->name . ' telah sukses terdaftar di perpustakaan.'
            ]
        ]);
    }

    public function show(string $id)
    {
        $member = User::where('role', 'member')
            ->with(['peminjamans' => function($q) {
                $q->with(['detailPeminjaman.buku', 'struk'])->latest();
            }])
            ->findOrFail($id);

        return Inertia::render('Members/Show', [
            'member' => $member
        ]);
    }

    public function edit(string $id)
    {
        $member = User::where('role', 'member')->findOrFail($id);

        return Inertia::render('Members/Edit', [
            'member' => $member
        ]);
    }

    public function update(Request $request, string $id)
    {
        $member = User::where('role', 'member')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $member->id,
            'no_telp' => 'nullable|string|max:20',
            'no_identitas' => 'nullable|string|max:50',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $fotoPath = $member->foto;
        if ($request->hasFile('foto')) {
            // Hapus foto lama
            if ($member->foto && str_starts_with($member->foto, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $member->foto);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('foto')->store('avatars', 'public');
            $fotoPath = '/storage/' . $path;
        }

        $member->update([
            'name' => $request->name,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
            'no_identitas' => $request->no_identitas,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('members.index')->with([
            'success' => 'Data anggota berhasil diperbarui!',
            'notification' => [
                'type' => 'success',
                'title' => '✏️ Anggota Diperbarui',
                'message' => 'Data profil anggota ' . $member->name . ' telah berhasil diperbarui.'
            ]
        ]);
    }

    public function destroy(string $id)
    {
        $member = User::where('role', 'member')->findOrFail($id);

        // Hapus foto lama dari storage
        if ($member->foto && str_starts_with($member->foto, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $member->foto);
            Storage::disk('public')->delete($oldPath);
        }

        $memberName = $member->name;
        $member->delete();

        return redirect()->route('members.index')->with([
            'success' => 'Anggota berhasil dihapus!',
            'notification' => [
                'type' => 'warning',
                'title' => '🗑️ Anggota Dihapus',
                'message' => 'Anggota bernama ' . $memberName . ' telah dihapus secara permanen.'
            ]
        ]);
    }
}
