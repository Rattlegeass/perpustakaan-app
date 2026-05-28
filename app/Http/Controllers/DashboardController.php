<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Buku;
use App\Models\Peminjaman;
use App\Models\Denda;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalBooks = Buku::count();

        $totalBorrowings = Peminjaman::count();

        $totalFine = Denda::sum('jumlah_denda');

        $averageFine = Denda::avg('jumlah_denda');

        $maxFine = Denda::max('jumlah_denda');

        $minFine = Denda::min('jumlah_denda');

        $monthlyFines = Denda::selectRaw('
            MONTH(created_at) as month,
            SUM(jumlah_denda) as total
        ')->groupBy('month')->orderBy('month')->get();

        return Inertia::render('Dashboard', [
            'totalBooks' => $totalBooks,
            'totalBorrowings' => $totalBorrowings,
            'totalFine' => $totalFine,
            'averageFine' => $averageFine,
            'maxFine' => $maxFine,
            'minFine' => $minFine,
            'monthlyFines' => $monthlyFines,
        ]);
    }
}
