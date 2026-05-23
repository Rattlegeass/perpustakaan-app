<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Struk;
use App\Models\Peminjaman;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class StrukController extends Controller
{
    /**
     * Generate Struk PDF dan simpan path ke database
     * 
     * @param Peminjaman $peminjaman
     * @return void
     */
    public function generate(Peminjaman $peminjaman)
    {
        // 1. Generate nomor struk unik
        $noStruk = 'STK-' . now()->format('Ymd') . '-' . str_pad($peminjaman->id, 5, '0', STR_PAD_LEFT);
        
        // 2. Load data yang diperlukan untuk PDF
        $peminjaman->load(['user', 'detailPeminjaman.buku']);
        
        // 3. Generate PDF dari view template
        $pdf = Pdf::loadView('struks.template', [
            'noStruk' => $noStruk,
            'peminjaman' => $peminjaman,
            'tanggalSekarang' => now()->format('d-m-Y H:i:s'),
        ]);
        
        // 4. Tentukan nama dan path file
        $fileName = 'struk-' . $peminjaman->id . '-' . now()->format('YmdHis') . '.pdf';
        $filePath = 'struks/' . $fileName;
        
        // 5. Simpan PDF ke storage
        Storage::disk('public')->put($filePath, $pdf->output());
        
        // 6. Simpan data struk ke database dengan path_file
        Struk::create([
            'peminjaman_id' => $peminjaman->id,
            'no_struk' => $noStruk,
            'jam_dibuat' => now(),
            'path_file' => $filePath,
        ]);
    }

    /**
     * Download PDF Struk yang sudah tersimpan
     * 
     * @param Struk $struk
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function download(Struk $struk)
    {
        // Cek apakah file masih ada di storage
        if (!Storage::disk('public')->exists($struk->path_file)) {
            return back()->with('error', 'File struk tidak ditemukan');
        }

        // Download file PDF
        return Storage::disk('public')->download(
            $struk->path_file,
            'Struk-' . $struk->no_struk . '.pdf'
        );
    }

    /**
     * Regenerate Struk (jika dibutuhkan update data)
     * 
     * @param Struk $struk
     * @return \Illuminate\Http\RedirectResponse
     */
    public function regenerate(Struk $struk)
    {
        // 1. Hapus file PDF lama dari storage jika ada
        if (Storage::disk('public')->exists($struk->path_file)) {
            Storage::disk('public')->delete($struk->path_file);
        }

        // 2. Load data peminjaman terbaru
        $peminjaman = $struk->peminjaman;
        $peminjaman->load(['user', 'detailPeminjaman.buku']);
        
        // 3. Generate PDF baru
        $pdf = Pdf::loadView('struks.template', [
            'noStruk' => $struk->no_struk,
            'peminjaman' => $peminjaman,
            'tanggalSekarang' => now()->format('d-m-Y H:i:s'),
        ]);

        // 4. Simpan PDF baru dengan nama file baru
        $newFileName = 'struk-' . $peminjaman->id . '-' . now()->format('YmdHis') . '.pdf';
        $newFilePath = 'struks/' . $newFileName;
        
        Storage::disk('public')->put($newFilePath, $pdf->output());

        // 5. Update path_file di database
        $struk->update([
            'path_file' => $newFilePath,
            'jam_dibuat' => now(),
        ]);

        return back()->with('success', 'Struk berhasil di-regenerate');
    }

    /**
     * Preview Struk (tampilkan di browser)
     * 
     * @param Struk $struk
     * @return \Illuminate\Http\Response
     */
    public function preview(Struk $struk)
    {
        // Cek apakah file ada
        if (!Storage::disk('public')->exists($struk->path_file)) {
            return back()->with('error', 'File struk tidak ditemukan');
        }

        // Tampilkan PDF di browser
        return Storage::disk('public')->response($struk->path_file);
    }
}
