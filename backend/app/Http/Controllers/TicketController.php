<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\TicketRequest;

class TicketController extends Controller
{
    public function store(TicketRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
    
        if ($user->hasRole('admin')) {
            
            $data['user_id'] = $request->input('user_id', null);
        } else {
           
            $data['user_id'] = $user->id;
        }
    
        $ticket = Ticket::create($data);
    
        return response()->json($ticket);
    }

    public function show_ticket(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        if ($user->hasRole('admin')) {
            $allTickets = Ticket::with('user')->get();
            return response()->json([
                'tickets' => $allTickets,
            ]);
        }

    
        $myTickets = Ticket::with('user')->where('user_id', $user->id)->get();
        $todoTickets = Ticket::where('status', 'todo')->whereNull('user_id')->get();
    
        $allTickets = $myTickets->merge($todoTickets)->values();
    
        return response()->json([
            'tickets' => $allTickets,
        ]);
    }



    public function ticket_status_update(Request $request, $id)
    {
        $user = $request->user();
    
        $request->validate([
            'status' => 'required|string|in:todo,in-progress,done'
        ]);
    
        $ticket = Ticket::find($id);
    
        if (!$ticket) {
            return response()->json(['error' => 'Ticket non trouvé'], 404);
        }
    
       
        if ($ticket->user_id== $user->id || $user->hasRole("admin"))
        { $ticket->status = $request->input('status');
            $ticket->save();
        
            $ticket->load('user');
        
            return response()->json($ticket);
           
        }
        return response()->json(['error' => 'Non autorisé'], 403);
       
    }

}
