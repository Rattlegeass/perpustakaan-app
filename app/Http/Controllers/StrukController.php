<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Struk;
use App\Models\Peminjaman;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
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
        // 1. Cek apakah data struk sudah ada untuk peminjaman ini
        $struk = Struk::where('peminjaman_id', $peminjaman->id)->first();

        // 2. Tentukan nomor struk (gunakan yang sudah ada jika ada)
        $noStruk = $struk ? $struk->no_struk : ('STK-' . now()->format('Ymd') . '-' . str_pad($peminjaman->id, 5, '0', STR_PAD_LEFT));
        
        // 3. Load data yang diperlukan untuk PDF
        $peminjaman->load(['user', 'detailPeminjaman.buku', 'detailPeminjaman.dendas']);
        
        // 4. Generate PDF dari view template
        $pdf = Pdf::loadView('struks.template', [
            'noStruk' => $noStruk,
            'peminjaman' => $peminjaman,
            'tanggalSekarang' => now()->format('d-m-Y H:i:s'),
        ]);
        
        // 5. Tentukan nama dan path file
        $fileName = 'struk-' . $peminjaman->id . '-' . now()->format('YmdHis') . '.pdf';
        $filePath = 'struks/' . $fileName;
        
        // 6. Hapus PDF lama dari storage jika ada
        if ($struk && $struk->path_file && Storage::disk('public')->exists($struk->path_file)) {
            Storage::disk('public')->delete($struk->path_file);
        }

        // 7. Simpan PDF baru ke storage
        Storage::disk('public')->put($filePath, $pdf->output());
        
        // 8. Simpan/update data struk ke database
        if ($struk) {
            $struk->update([
                'path_file' => $filePath,
                'jam_dibuat' => now(),
            ]);
        } else {
            Struk::create([
                'peminjaman_id' => $peminjaman->id,
                'no_struk' => $noStruk,
                'jam_dibuat' => now(),
                'path_file' => $filePath,
            ]);
        }
    }

    /**
     * Download PDF Struk yang sudah tersimpan
     * 
     * @param Struk $struk
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function download(Struk $struk)
    {
        // Cek apakah path_file ada
        if (!$struk->path_file) {
            return back()->with('error', 'Struk belum bisa diunduh - buku masih menunggu pengambilan atau belum diadministrasi');
        }

        // Cek apakah file masih ada di storage
        if (!Storage::disk('public')->exists($struk->path_file)) {
            return back()->with('error', 'File struk tidak ditemukan di storage');
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
        $peminjaman->load(['user', 'detailPeminjaman.buku', 'detailPeminjaman.dendas']);
        
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
        // Cek apakah path_file ada
        if (!$struk->path_file) {
            return back()->with('error', 'Struk belum bisa dilihat - buku masih menunggu pengambilan atau belum diadministrasi');
        }

        // Cek apakah file ada
        if (!Storage::disk('public')->exists($struk->path_file)) {
            return back()->with('error', 'File struk tidak ditemukan di storage');
        }

        // Tampilkan PDF di browser
        return Storage::disk('public')->response($struk->path_file);
    }

    /**
     * Member Download Struk (dengan authorization check)
     * 
     * @param Struk $struk
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function memberDownload(Struk $struk)
    {
        // Cek apakah struk milik member yang login
        if ($struk->peminjaman->user_id !== Auth::id()) {
            abort(403, 'Anda tidak diizinkan mengakses struk ini');
        }

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
     * Member Preview Struk (dengan authorization check)
     * 
     * @param Struk $struk
     * @return \Illuminate\Http\Response
     */
    public function memberPreview(Struk $struk)
    {
        // Cek apakah struk milik member yang login
        if ($struk->peminjaman->user_id !== Auth::id()) {
            abort(403, 'Anda tidak diizinkan mengakses struk ini');
        }

        // Cek apakah file ada
        if (!Storage::disk('public')->exists($struk->path_file)) {
            return back()->with('error', 'File struk tidak ditemukan');
        }

        // Tampilkan PDF di browser
        return Storage::disk('public')->response($struk->path_file);
    }
}
