<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\FinesExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function exportPdf()
    {
        $fines = Fine::with('borrowing.borrower')->get();

        $pdf = Pdf::loadView(
            'reports.fines-pdf',
            [
                'fines' => $fines
            ]
        );

        return $pdf->download('laporan-denda.pdf');
    }

    public function exportExcel()
    {
        return Excel::download(
            new FinesExport,
            'laporan-denda.xlsx'
        );
    }
}