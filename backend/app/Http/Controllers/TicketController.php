<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\TicketRequest;
use Barryvdh\DomPDF\Facade\Pdf;

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

        $data['created_by'] = $user->id;

        if($request->status =='done'){
            $data['done_at'] = now();
        }else{
            $data['done_at'] =null;
        }
        $ticket = Ticket::create($data);
        $ticket->load('user');
        return response()->json($ticket);
    }

    public function show_ticket(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        if ($user->hasRole('admin')) {
            $allTickets = Ticket::with(['user', 'creator'])->get();
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

    public function show_tickets_paginated(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $status = $request->input('status', '');

        $query = Ticket::with(['user', 'creator']);


        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

       
        if ($status) {
            $query->where('status', $status);
        }


        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

       
        $query->orderBy('created_at', 'desc');

        $tickets = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'tickets' => $tickets->items(),
            'pagination' => [
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
                'from' => $tickets->firstItem(),
                'to' => $tickets->lastItem(),
            ]
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
            if($request->status == 'done'){
            $ticket->done_at = now();
             }else{$ticket->done_at =null;}
            $ticket->save();
        
            $ticket->load('user');
        
            return response()->json($ticket);
           
        }
        return response()->json(['error' => 'Non autorisé'], 403);
       
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->update($request->all());
        $ticket->load('user');
        return response()->json($ticket);
    }

    public function exportTicketPDF(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $ticket = Ticket::with([
            'user',
            'creator',
            'comments.user',
            'comments.attachments',
        ])->find($id);
        
        if (!$ticket) {
            return response()->json(['error' => 'Ticket non trouvé'], 404);
        }

       
        if ($ticket->user_id != $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Non autorisé à exporter ce ticket'], 403);
        }

        
        $pdf = Pdf::loadView('pdf.ticket', [
            'ticket' => $ticket,
        ])->setPaper('a4', 'portrait');

     
        return $pdf->download('ticket-' . $ticket->id . '.pdf');
    }
}
