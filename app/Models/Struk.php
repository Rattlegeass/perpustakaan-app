<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Struk extends Model
{
    protected $table = 'struks';

    protected $fillable = [
        'peminjaman_id',
        'no_struk',
        'jam_dibuat',
        'path_file',
    ];

    protected $casts = [
        'jam_dibuat' => 'datetime',
    ];

    public function peminjaman()
    {
        return $this->belongsTo(Peminjaman::class);
    }
}
