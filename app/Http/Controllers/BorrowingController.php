<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\BorrowingDetail;
use App\Models\Fine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BorrowingController extends Controller
{
    public function index()
    {
        $borrowings = Borrowing::with([
            'borrower',
            'details.book'
        ])->latest()->get();

        return Inertia::render('Borrowings/Index', [
            'borrowings' => $borrowings
        ]);
    }
    
    public function create()
    {
        $books = Book::where('stock', '>', 0)->get();

        return Inertia::render('Borrowings/Create', [
            'books' => $books
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required',
            'due_date' => 'required',
        ]);

        $borrowing = Borrowing::create([
            'borrower_id' => Auth::id(),
            'officer_id' => Auth::id(),
            'borrow_date' => now(),
            'due_date' => $request->due_date,
            'status' => 'borrowed',
        ]);

        BorrowingDetail::create([
            'borrowing_id' => $borrowing->id,
            'book_id' => $request->book_id,
        ]);

        $book = Book::find($request->book_id);

        $book->decrement('stock');

        return redirect('/borrowings');
    }

    public function returnBook(Borrowing $borrowing)
    {
        $borrowing->update([
            'status' => 'returned'
        ]);

        foreach ($borrowing->details as $detail) {

            $detail->update([
                'return_date' => now()
            ]);

            $detail->book->increment('stock');
        }

        $lateDays = now()->diffInDays($borrowing->due_date, false);

        if ($lateDays < 0) {

            $lateDays = abs($lateDays);

            Fine::create([
                'borrowing_id' => $borrowing->id,
                'late_days' => $lateDays,
                'total_fine' => $lateDays * 5000,
                'payment_status' => 'unpaid',
            ]);

            $borrowing->update([
                'status' => 'late'
            ]);
        }

        return redirect('/borrowings');
    }
}
