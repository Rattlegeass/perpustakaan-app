<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Carbon\Carbon;

class ReportExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $data;
    protected $type;
    protected $title;

    public function __construct($data, $type, $title)
    {
        $this->data = $data;
        $this->type = $type;
        $this->title = $title;
    }

    // 1. Mengirim Data ke Excel
    public function collection()
    {
        return collect($this->data);
    }

    // 2. Membuat Judul Kolom (Header) Excel secara dinamis
    public function headings(): array
    {
        if (in_array($this->type, ['semua', 'peminjaman', 'aktif', 'populer', 'statistik'])) {
            return ['Nama Peminjam', 'Tanggal Pinjam', 'Status Peminjaman', 'Total Denda (Rp)'];
        } elseif ($this->type === 'denda') {
            return ['Nama Peminjam', 'Jumlah Denda (Rp)', 'Status Pembayaran'];
        } elseif ($this->type === 'anggota') {
            return ['Nama Anggota', 'Email', 'Bergabung Sejak'];
        } elseif ($this->type === 'buku') {
            return ['Judul Buku', 'Penulis', 'Penerbit', 'Stok Tersedia'];
        }

        return ['Data'];
    }

    // 3. Memetakan baris isi datanya
    public function map($item): array
    {
        if (in_array($this->type, ['semua', 'peminjaman', 'aktif', 'populer', 'statistik'])) {
            // Hitung denda lokal
            $denda = 0;
            $details = is_iterable($item->detailPeminjaman) ? $item->detailPeminjaman : [$item->detailPeminjaman];
            foreach ($details as $det) {
                if ($det && $det->dendas) {
                    foreach ($det->dendas as $dendaItem) {
                        $denda += $dendaItem->jumlah_denda;
                    }
                }
            }

            return [
                $item->user->name ?? 'User Dihapus',
                $item->tgl_peminjaman ? Carbon::parse($item->tgl_peminjaman)->format('d-m-Y') : '-',
                strtoupper(str_replace('_', ' ', $item->status_peminjaman)),
                number_format($denda, 0, ',', '.') // Format angka ribuan
            ];
        } 
        elseif ($this->type === 'denda') {
            return [
                $item->detailPeminjaman->peminjaman->user->name ?? 'User Dihapus',
                number_format($item->jumlah_denda, 0, ',', '.'),
                strtoupper($item->status_pembayaran ?? 'BELUM DIBAYAR')
            ];
        } 
        elseif ($this->type === 'anggota') {
            return [
                $item->name,
                $item->email,
                $item->created_at ? Carbon::parse($item->created_at)->format('d-m-Y') : '-'
            ];
        } 
        elseif ($this->type === 'buku') {
            return [
                $item->judul,
                $item->penulis,
                $item->penerbit,
                $item->stok
            ];
        }

        return [];
    }
}