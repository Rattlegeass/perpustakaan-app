<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $notifications = [];

        if ($user) {
            if ($user->role === 'admin') {
                // Fetch admin alerts
                // 1. Pending approvals
                $pendingApprovals = \App\Models\Peminjaman::where('status_peminjaman', 'menunggu_persetujuan')->count();
                if ($pendingApprovals > 0) {
                    $notifications[] = [
                        'title' => '⏳ Persetujuan Tertunda',
                        'message' => "Ada {$pendingApprovals} peminjaman baru yang menunggu persetujuan Anda.",
                        'time' => 'Perlu Verifikasi'
                    ];
                }

                // 2. Ready for pickup
                $pendingPickups = \App\Models\Peminjaman::where('status_peminjaman', 'menunggu_pengambilan')->count();
                if ($pendingPickups > 0) {
                    $notifications[] = [
                        'title' => '📦 Buku Siap Diambil',
                        'message' => "Ada {$pendingPickups} peminjaman yang menunggu konfirmasi pengambilan oleh member.",
                        'time' => 'Perlu Tindakan'
                    ];
                }

                // 3. Members with unpaid fines
                $unpaidFines = \App\Models\Denda::where('status_pembayaran', 'belum_bayar')->count();
                if ($unpaidFines > 0) {
                    $notifications[] = [
                        'title' => '⚠️ Tunggakan Denda Member',
                        'message' => "Ada {$unpaidFines} denda member yang belum dibayar.",
                        'time' => 'Perlu Tindakan'
                    ];
                }
            } else {
                // Fetch member alerts
                // 1. Approved but not picked up
                $myPickups = \App\Models\Peminjaman::where('user_id', $user->id)
                    ->where('status_peminjaman', 'menunggu_pengambilan')
                    ->count();
                if ($myPickups > 0) {
                    $notifications[] = [
                        'title' => '📦 Buku Siap Diambil!',
                        'message' => 'Peminjaman Anda disetujui. Silakan segera ambil buku di perpustakaan.',
                        'time' => 'Penting'
                    ];
                }

                // 2. Active loans that are late or due soon
                $myActiveLoans = \App\Models\Peminjaman::where('user_id', $user->id)
                    ->whereIn('status_peminjaman', ['dipinjam', 'terlambat'])
                    ->get();
                
                foreach ($myActiveLoans as $loan) {
                    if ($loan->status_peminjaman === 'terlambat') {
                        $notifications[] = [
                            'title' => '⏰ Keterlambatan Pengembalian!',
                            'message' => "Batas pengembalian buku peminjaman #{$loan->id} telah terlewat. Segera kembalikan!",
                            'time' => 'Terlambat'
                        ];
                    } else if ($loan->batas_tgl_peminjaman) {
                        $due = \Carbon\Carbon::parse($loan->batas_tgl_peminjaman)->startOfDay();
                        $now = \Carbon\Carbon::now()->startOfDay();
                        if ($now->greaterThanOrEqualTo($due->copy()->subDays(2))) {
                            $daysLeft = (int) $now->diffInDays($due);
                            $notifications[] = [
                                'title' => '⏳ Batas Pengembalian Dekat',
                                'message' => "Peminjaman #{$loan->id} harus dikembalikan dalam {$daysLeft} hari.",
                                'time' => 'Tenggat Waktu'
                            ];
                        }
                    }
                }

                // 3. Unpaid fines
                $myUnpaidFinesCount = \App\Models\Denda::whereHas('detailPeminjaman.peminjaman', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                })->where('status_pembayaran', 'belum_bayar')->count();

                if ($myUnpaidFinesCount > 0) {
                    $notifications[] = [
                        'title' => '⚠️ Tagihan Denda Aktif',
                        'message' => "Anda memiliki {$myUnpaidFinesCount} denda yang belum dibayar. Silakan bayar melalui admin.",
                        'time' => 'Tunggakan'
                    ];
                }
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'notifications' => $notifications,
            ],
        ];
    }
}
