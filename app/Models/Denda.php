<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Denda extends Model
{
    protected $fillable = [
        'detail_peminjaman_id',
        'jumlah_hari_terlambat',
        'total_denda',
        'status_pembayaran',
    ];

    public function detailPeminjaman()
    {
        return $this->belongsTo(DetailPeminjaman::class);
    }
}
