<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Buku;
use App\Models\Peminjaman;
use App\Models\Denda;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role;

        if ($role === 'admin' || $role === 'petugas') {
            $totalBooks = Buku::count();
            $totalBorrowings = Peminjaman::count();
            
            // Active loans = currently borrowed or late
            $activeLoans = Peminjaman::whereIn('status_peminjaman', ['dipinjam', 'terlambat'])->count();
            
            // Fines stats (collected vs unpaid)
            $finesCollected = Denda::where('status_pembayaran', 'lunas')->sum('jumlah_denda') ?: 0;
            $finesUnpaid = Denda::where('status_pembayaran', 'belum_bayar')->sum('jumlah_denda') ?: 0;
            
            // Pending tasks for admin attention
            $pendingApprovals = Peminjaman::where('status_peminjaman', 'menunggu_persetujuan')->count();
            $pendingPickups = Peminjaman::where('status_peminjaman', 'menunggu_pengambilan')->count();

            // Monthly fines aggregation - database-agnostic using Collection to support SQLite and MySQL
            $dendas = Denda::all();
            $monthsMap = [
                1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
                5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu',
                9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
            ];
            
            $monthlyFines = [];
            for ($i = 1; $i <= 12; $i++) {
                $monthlyFines[$i] = [
                    'month' => $i,
                    'month_name' => $monthsMap[$i],
                    'total' => 0.0
                ];
            }

            foreach ($dendas as $denda) {
                if ($denda->created_at) {
                    $monthNum = (int)$denda->created_at->format('n');
                    $monthlyFines[$monthNum]['total'] += (float)$denda->jumlah_denda;
                }
            }
            $monthlyFines = array_values($monthlyFines);

            // Recent loan transactions (limit to 5)
            $recentLoans = Peminjaman::with(['user', 'detailPeminjaman.buku'])
                ->latest()
                ->limit(5)
                ->get();

            // Top borrowed books
            $topBooks = \App\Models\DetailPeminjaman::select('buku_id')
                ->selectRaw('COUNT(id) as count')
                ->groupBy('buku_id')
                ->orderByDesc('count')
                ->limit(5)
                ->with('buku')
                ->get();

            return Inertia::render('Dashboard', [
                'role' => $role,
                'adminData' => [
                    'totalBooks' => $totalBooks,
                    'totalBorrowings' => $totalBorrowings,
                    'activeLoans' => $activeLoans,
                    'finesCollected' => (float)$finesCollected,
                    'finesUnpaid' => (float)$finesUnpaid,
                    'pendingApprovals' => $pendingApprovals,
                    'pendingPickups' => $pendingPickups,
                    'monthlyFines' => $monthlyFines,
                    'recentLoans' => $recentLoans,
                    'topBooks' => $topBooks
                ]
            ]);
        } else {
            // Member dashboard statistics
            $activeLoansCount = \App\Models\DetailPeminjaman::whereHas('peminjaman', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->where('status_buku', 'dipinjam')->count();

            $totalLoansCount = \App\Models\DetailPeminjaman::whereHas('peminjaman', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->count();

            $unpaidFinesSum = Denda::whereHas('detailPeminjaman.peminjaman', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->where('status_pembayaran', 'belum_bayar')->sum('jumlah_denda') ?: 0;

            $paidFinesSum = Denda::whereHas('detailPeminjaman.peminjaman', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->where('status_pembayaran', 'lunas')->sum('jumlah_denda') ?: 0;

            // Personal loans list (limit to 5)
            $myLoans = Peminjaman::where('user_id', $user->id)
                ->with(['detailPeminjaman.buku', 'detailPeminjaman.dendas'])
                ->latest()
                ->limit(5)
                ->get();

            // Book recommendations (limit to 4 available books in random order)
            $bookRecommendations = Buku::where('stok', '>', 0)
                ->inRandomOrder()
                ->limit(4)
                ->get();

            return Inertia::render('Dashboard', [
                'role' => 'member',
                'memberData' => [
                    'activeLoansCount' => $activeLoansCount,
                    'totalLoansCount' => $totalLoansCount,
                    'unpaidFinesSum' => (float)$unpaidFinesSum,
                    'paidFinesSum' => (float)$paidFinesSum,
                    'myLoans' => $myLoans,
                    'bookRecommendations' => $bookRecommendations
                ]
            ]);
        }
    }
}
