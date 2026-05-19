<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    protected $fillable = [
        'borrowing_id',
        'late_days',
        'total_fine',
        'payment_status',
    ];
    
    public function borrowing()
    {
        return $this->belongsTo(Borrowing::class);
    }
}
