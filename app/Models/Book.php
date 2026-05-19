<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'publisher',
        'publish_year',
        'stock'
    ];

    public function borrowingDetails()
    {
        return $this->hasMany(BorrowingDetail::class);
    }
}
