<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();
        
        $fotoUrl = $user->foto ? (str_starts_with($user->foto, 'http') ? $user->foto : (str_starts_with($user->foto, '/storage/') ? asset($user->foto) : asset('storage/' . $user->foto))) : null;

        return Inertia::render('Profile/Edit', [
            'foto_url' => $fotoUrl,
            'statistik' => [
                'bukuDipinjam' => 12,
                'favorit' => 8,
                'sedangDibaca' => 3,
            ]
        ]);
    }

    public function edit(Request $request): Response
    {
        $user = $request->user();

        $fotoUrl = $user->foto ? (str_starts_with($user->foto, 'http') ? $user->foto : (str_starts_with($user->foto, '/storage/') ? asset($user->foto) : asset('storage/' . $user->foto))) : null;

        return Inertia::render('Profile/Editprofile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'foto_url' => $fotoUrl, 
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Validasi untuk foto dan sinyal hapus
        $request->validate([
            'foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'hapus_foto' => ['nullable', 'string', 'in:true,false,1,0'], 
        ]);

        // Jika frontend mengirimkan sinyal untuk menghapus foto
        if ($request->boolean('hapus_foto')) {
            if ($user->foto) {
                $oldPath = str_replace('/storage/', '', $user->foto);
                Storage::disk('public')->delete($oldPath); 
            }
            $user->foto = null; 
        }

        // Jika user mengunggah foto baru
        if ($request->hasFile('foto')) {
            if ($user->foto) {
                $oldPath = str_replace('/storage/', '', $user->foto);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto')->store('fotos', 'public');
            $user->foto = '/storage/' . $path;
        }

        // FUNGSI BAWAAN: Mengambil Nama dan Email
        $user->fill($request->validated());

        // 👇 INI YANG DITAMBAHKAN AGAR DATANYA MASUK DB 👇
        $user->no_telp = $request->no_telp;
        $user->no_identitas = $request->no_identitas;

        // Mengecek apakah email berubah untuk verifikasi ulang
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Simpan ke Database MySQL
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        if ($user->foto) {
            $oldPath = str_replace('/storage/', '', $user->foto);
            Storage::disk('public')->delete($oldPath);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}