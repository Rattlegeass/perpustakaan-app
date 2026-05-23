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

        $totalFine = Denda::sum('total_denda');

        $averageFine = Denda::avg('total_denda');

        $maxFine = Denda::max('total_denda');

        $minFine = Denda::min('total_denda');

        $monthlyFines = Denda::selectRaw('
            MONTH(created_at) as month,
            SUM(total_denda) as total
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
