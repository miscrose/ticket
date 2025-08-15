<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ticket_comments extends Model
{
    protected $fillable = [
        'ticket_id',
        'user_id',
        'content',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function ticket() {
        return $this->belongsTo(Ticket::class);
    }
    public function attachments() {
        return $this->hasMany(ticket_comment_attachments::class, 'ticket_comment_id');
    }
}
