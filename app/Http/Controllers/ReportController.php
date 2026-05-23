<?php

namespace App\Http\Controllers;

use App\Models\Denda;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\DendasExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function exportPdf()
    {
        $dendas = Denda::with('detailPeminjaman.peminjaman.user')->get();

        $pdf = Pdf::loadView(
            'reports.fines-pdf',
            [
                'dendas' => $dendas
            ]
        );

        return $pdf->download('laporan-denda.pdf');
    }

    public function exportExcel()
    {
        return Excel::download(
            new DendasExport,
            'laporan-denda.xlsx'
        );
    }
}