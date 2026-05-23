<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPeminjaman extends Model
{
    protected $table = 'detail_peminjamans';

    protected $fillable = [
        'peminjaman_id',
        'buku_id',
        'tgl_pengembalian',
        'status_buku',
        'catatan_kondisi',
    ];

    protected $casts = [
        'tgl_pengembalian' => 'date',
    ];

    public function peminjaman()
    {
        return $this->belongsTo(Peminjaman::class);
    }

    public function buku()
    {
        return $this->belongsTo(Buku::class);
    }

    public function dendas()
    {
        return $this->hasMany(Denda::class);
    }
}
