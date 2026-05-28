<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buku extends Model
{
    use HasFactory;
    protected $table = 'bukus';

    protected $fillable = [
        'judul',
        'penulis',
        'penerbit',
        'tahun_terbit',
        'stok',
        'kategori',
        'sinopsis',
        'cover',
    ];

    public function detailPeminjamans()
    {
        return $this->hasMany(DetailPeminjaman::class);
    }
}
