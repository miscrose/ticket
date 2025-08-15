<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
      'title',
    'description',
    'status',
    'priority',
    'user_id',
    'done_at',
    'created_by',
    ];

    public function user() {
      return $this->belongsTo(User::class);
  }
  public function creator()
{
    return $this->belongsTo(User::class, 'created_by');
}
}
