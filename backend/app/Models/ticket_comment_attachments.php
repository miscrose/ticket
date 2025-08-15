<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ticket_comment_attachments extends Model
{
    protected $fillable = [
        'ticket_comment_id',
        'url',
    ];

    public function comment() {
        return $this->belongsTo(ticket_comments::class, 'ticket_comment_id');
    }
}
