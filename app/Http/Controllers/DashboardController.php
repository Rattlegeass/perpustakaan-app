<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Fine;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalBooks = Book::count();

        $totalBorrowings = Borrowing::count();

        $totalFine = Fine::sum('total_fine');

        $averageFine = Fine::avg('total_fine');

        $maxFine = Fine::max('total_fine');

        $minFine = Fine::min('total_fine');

        $monthlyFines = Fine::selectRaw('
            MONTH(created_at) as month,
            SUM(total_fine) as total
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
