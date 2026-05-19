<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    protected $fillable = [
        'borrower_id',
        'officer_id',
        'borrow_date',
        'due_date',
        'status',
    ];
    
    public function borrower()
    {
        return $this->belongsTo(User::class, 'borrower_id');
    }

    public function officer()
    {
        return $this->belongsTo(User::class, 'officer_id');
    }

    public function details()
    {
        return $this->hasMany(BorrowingDetail::class);
    }

    public function fine()
    {
        return $this->hasOne(Fine::class);
    }
}
