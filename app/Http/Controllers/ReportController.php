<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use App\Models\Denda;
use App\Models\User;
use App\Models\Buku;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // 1. Filter Tanggal & Pencarian
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        $search = $request->input('search');

        // 2. Query Utama (untuk tabel) dengan pencarian nama
        // Menggunakan tgl_peminjaman sesuai database
        $query = Peminjaman::with(['user', 'detailPeminjaman.buku', 'detailPeminjaman.dendas'])
            ->whereBetween('tgl_peminjaman', [$startDate, $endDate]);

        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }
        $peminjamans = $query->latest('tgl_peminjaman')->get();

        // 3. Ambil Semua Data di Rentang Tanggal untuk Analisis
        $allStats = Peminjaman::with(['detailPeminjaman.buku', 'detailPeminjaman.dendas'])
            ->whereBetween('tgl_peminjaman', [$startDate, $endDate])
            ->get();

        // Variabel untuk 5 Cards & Buku Terpopuler
        $peminjamanAktif = 0;
        $dikembalikan = 0;
        $terlambat = 0;
        $totalBukuDipinjam = 0;
        $totalDenda = 0;
        $bukuCounts = [];

        foreach ($allStats as $p) {
            // Hitung Status (Menggunakan status_peminjaman)
            if ($p->status_peminjaman === 'dipinjam' || $p->status_peminjaman === 'menunggu_pengambilan') {
                $peminjamanAktif++;
            } elseif ($p->status_peminjaman === 'dikembalikan') {
                $dikembalikan++;
            } elseif ($p->status_peminjaman === 'terlambat') {
                $terlambat++;
            }

            // Hitung Buku & Denda
            $details = is_iterable($p->detailPeminjaman) ? $p->detailPeminjaman : [$p->detailPeminjaman];
            foreach ($details as $detail) {
                if ($detail) {
                    $totalBukuDipinjam++;
                    
                    if ($detail->dendas) {
                        foreach ($detail->dendas as $dendaItem) {
                            $totalDenda += $dendaItem->jumlah_denda;
                        }
                    }

                    // Kumpulkan ranking buku
                    if ($detail->buku) {
                        $bukuId = $detail->buku->id;
                        if (!isset($bukuCounts[$bukuId])) {
                            $bukuCounts[$bukuId] = ['judul' => $detail->buku->judul, 'jumlah' => 0];
                        }
                        $bukuCounts[$bukuId]['jumlah']++;
                    }
                }
            }
        }

        // Urutkan Buku Terpopuler (Ranking 1-5)
        usort($bukuCounts, function($a, $b) {
            return $b['jumlah'] <=> $a['jumlah'];
        });
        $bukuPopuler = array_slice($bukuCounts, 0, 5);

        return Inertia::render('Reports/Index', [
            'peminjamans' => $peminjamans,
            'stats' => [
                'totalBuku' => $totalBukuDipinjam,
                'aktif' => $peminjamanAktif,
                'denda' => $totalDenda,
                'dikembalikan' => $dikembalikan,
                'terlambat' => $terlambat,
            ],
            'bukuPopuler' => $bukuPopuler,
            'filter' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'search' => $search
            ],
            'lastUpdated' => Carbon::now()->format('d M Y H:i')
        ]);
    }

    // FUNGSI: Mengambil data sesuai pilihan dari Modal Export (PDF/Excel)
    private function getExportData(Request $request)
    {
        $type = $request->input('type', 'semua');
        $start = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $end = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        $search = $request->input('search');

        $title = 'Laporan Perpustakaan';
        $data = [];

        // 1. Data Transaksi, Peminjaman, atau Aktif
        if (in_array($type, ['semua', 'peminjaman', 'aktif'])) {
            $query = Peminjaman::with(['user', 'detailPeminjaman.buku', 'detailPeminjaman.dendas'])
                ->whereBetween('tgl_peminjaman', [$start, $end]);

            if ($search) {
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            }

            // Filter tambahan berdasarkan status_peminjaman
            if ($type === 'aktif') {
                $query->whereIn('status_peminjaman', ['dipinjam', 'menunggu_pengambilan']);
                $title = 'Laporan Peminjaman Aktif';
            } elseif ($type === 'peminjaman') {
                $title = 'Laporan Transaksi Peminjaman';
            } else {
                $title = 'Laporan Semua Transaksi & Denda';
            }
            $data = $query->latest('tgl_peminjaman')->get();
        }
        // 2. Data Khusus Denda
        elseif ($type === 'denda') {
            $title = 'Laporan Data Denda';
            $data = Denda::with(['detailPeminjaman.peminjaman.user'])->get(); 
        }
        // 3. Data Anggota
        elseif ($type === 'anggota') {
            $title = 'Data Anggota Perpustakaan';
            $data = User::where('role', 'member')->get(); 
        }
        // 4. Data Buku
        elseif ($type === 'buku') {
            $title = 'Data Koleksi Buku';
            $data = Buku::latest()->get();
        }
        // 5. Data Populer / Statistik
        else {
            $title = 'Laporan Transaksi Umum';
            $data = Peminjaman::with(['user', 'detailPeminjaman.buku'])->whereBetween('tgl_peminjaman', [$start, $end])->get();
        }

        return ['data' => $data, 'title' => $title, 'type' => $type];
    }

    public function exportPdf(Request $request)
    {
        $export = $this->getExportData($request);

        $pdf = Pdf::loadView('reports.export-template', [
            'data' => $export['data'],
            'type' => $export['type'],
            'title' => $export['title']
        ]);

        return $pdf->download('laporan-pdf-'.date('Ymd').'.pdf');
    }

    public function exportExcel(Request $request)
    {
        $export = $this->getExportData($request);

        return Excel::download(
            new ReportExport($export['data'], $export['type'], $export['title']),
            'laporan-excel-'.date('Ymd').'.xlsx'
        );
    }
}