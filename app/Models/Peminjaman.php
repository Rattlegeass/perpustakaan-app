<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    protected $table = 'peminjamans';

    protected $fillable = [
        'user_id',
        'tgl_peminjaman',
        'batas_tgl_peminjaman',
        'status_peminjaman',
    ];

    protected $casts = [
        'tgl_peminjaman' => 'date',
        'batas_tgl_peminjaman' => 'date',
    ];

    public function detailPeminjaman()
    {
        return $this->hasMany(DetailPeminjaman::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function struk()
    {
        return $this->hasOne(Struk::class);
    }
}
