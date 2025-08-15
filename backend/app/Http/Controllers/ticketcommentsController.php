<?php

namespace App\Http\Controllers;

use App\Models\ticket_comments;
use Illuminate\Http\Request;

class ticketcommentsController extends Controller
{
   
    public function store(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'content' => 'required|string',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,webp,jfif,pdf,doc,docx|max:2048', 
        ]);
    
        $user = $request->user();
    
      
        $comment = ticket_comments::create([
            'ticket_id' => $request->ticket_id,
            'user_id' => $user->id,
            'content' => $request->content,
        ]);
    
      
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('comments', 'public');
                $comment->attachments()->create([
                    'url' => '/storage/' . $path,
                ]);
            }
        }
    
       
        $comment->load('attachments', 'user');
    
        return response()->json($comment, 201);
    }

    public function index(Request $request, $ticketId)
    {
        $comments = ticket_comments::with(['attachments', 'user'])
            ->where('ticket_id', $ticketId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

}
