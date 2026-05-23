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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth')->name('dashboard');;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('bukus', BukuController::class);
    Route::resource('peminjamans', PeminjamanController::class);

    // Routes untuk Struk
    Route::get('/struks/{struk}/download', [StrukController::class, 'download'])->name('struks.download');
    Route::get('/struks/{struk}/preview', [StrukController::class, 'preview'])->name('struks.preview');
    Route::post('/struks/{struk}/regenerate', [StrukController::class, 'regenerate'])->name('struks.regenerate');

    Route::get('/reports/pdf', [ReportController::class, 'exportPdf']);
    Route::get('/reports/excel', [ReportController::class, 'exportExcel']);
});

require __DIR__.'/auth.php';
