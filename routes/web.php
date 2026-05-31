<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BukuController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StrukController;
use App\Http\Controllers\MemberController;
use App\Models\Buku;

// Menggunakan Route::get('/') yang sudah mengambil koleksiBuku
Route::get('/', function () {
    // Ambil data 10 buku terbaru untuk ditampilkan di depan
    $koleksiBuku = Buku::latest()->take(10)->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'koleksiBuku' => $koleksiBuku, // Kirim datanya ke React di sini
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth')->name('dashboard');

// --- ADMIN ROUTES ---
Route::middleware(['auth', 'admin'])->group(function () {
    
    // CATATAN: Rute profil di sini saya hapus/komentari agar tidak terjadi 
    // bentrok (collision) dengan rute profil di grup 'auth' di bawah.
    // Karena Admin juga melewati middleware 'auth', mereka tetap bisa mengakses profil.
    /*
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    */

    Route::resource('bukus', BukuController::class);
    Route::resource('peminjamans', PeminjamanController::class);
    Route::resource('members', MemberController::class);
    
    // Route untuk approve peminjaman (ubah pending menjadi menunggu pengambilan)
    Route::patch('/peminjamans/{peminjaman}/approve', [PeminjamanController::class, 'approve'])->name('peminjamans.approve');
    
    // Route untuk reject peminjaman (ubah pending menjadi ditolak)
    Route::patch('/peminjamans/{peminjaman}/reject', [PeminjamanController::class, 'reject'])->name('peminjamans.reject');
    
    // Route untuk confirm pickup (ubah menunggu pengambilan menjadi dipinjam dengan deadline +7 hari)
    Route::patch('/peminjamans/{peminjaman}/confirm-pickup', [PeminjamanController::class, 'confirmPickup'])->name('peminjamans.confirmPickup');

    // Route untuk Manajemen Denda (Admin Only)
    Route::get('/dendas', [PeminjamanController::class, 'adminDendas'])->name('dendas.index');

    // Route untuk confirm bayar denda (Admin Only)
    Route::patch('/dendas/{denda}/bayar', [PeminjamanController::class, 'bayarDenda'])->name('dendas.bayar');

    // Routes untuk Struk (Admin Only)
    Route::get('/struks/{struk}/download', [StrukController::class, 'download'])->name('struks.download');
    Route::get('/struks/{struk}/preview', [StrukController::class, 'preview'])->name('struks.preview');
    Route::post('/struks/{struk}/regenerate', [StrukController::class, 'regenerate'])->name('struks.regenerate');

    Route::get('/reports/pdf', [ReportController::class, 'exportPdf']);
    Route::get('/reports/excel', [ReportController::class, 'exportExcel']);
});

// --- MEMBER & UMUM (AUTH) ROUTES ---
Route::middleware(['auth'])->group(function () {
    
    // 👇 PERBAIKAN RUTE PROFIL 👇
    // 1. URL /profile membuka fungsi show (Halaman utama profil)
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    
    // 2. URL /profile/edit membuka fungsi edit (Halaman form edit profil)
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    
    // Route update & destroy tetap sama, menggunakan path /profile
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // 👆 SELESAI PERBAIKAN 👆

    // Member - Daftar Buku
    Route::get('/daftar-buku', [BukuController::class, 'memberIndex'])->name('bukus.member');

    // Member - Peminjaman
    Route::get('/peminjamans-saya', [PeminjamanController::class, 'memberIndex'])->name('peminjamans.member');
    Route::post('/peminjamans-buat', [PeminjamanController::class, 'memberStore'])->name('peminjamans.member.store');
    Route::delete('/peminjamans-batal/{peminjaman}', [PeminjamanController::class, 'memberCancel'])->name('peminjamans.member.cancel');

    // Member - Struk Download (with authorization check)
    Route::get('/member-struks/{struk}/download', [StrukController::class, 'memberDownload'])->name('struks.member.download');
    Route::get('/member-struks/{struk}/preview', [StrukController::class, 'memberPreview'])->name('struks.member.preview');

    // Member - Denda
    Route::get('/dendas-saya', [PeminjamanController::class, 'memberDendas'])->name('dendas.member');
});

require __DIR__.'/auth.php';