<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class DashboardController extends Controller
{

    public function countTicketByPeriod(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        $days = $request->input('days', 7);
        $startDate = now()->subDays($days - 1)->startOfDay();
        $endDate = now()->endOfDay();

        if ($user->hasRole('admin')) {
            $statusCounts = Ticket::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status');
        } else {
            $statusCounts = Ticket::where('user_id', $user->id)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status');
        }

        return response()->json($statusCounts);
    }

  

    public function doneTicketsDetailsPerDay(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        $days = $request->input('days', 7);
        $startDate = now()->subDays($days - 1)->startOfDay();
        $endDate = now()->endOfDay();
    
        if ($user->hasRole('admin')) {
            $tickets = Ticket::whereNotNull('done_at')
                ->whereBetween('done_at', [$startDate, $endDate])
                ->get(['id', 'title', 'created_at', 'done_at']);
        } else {
            $tickets = Ticket::where('user_id', $user->id)
                ->whereNotNull('done_at')
                ->whereBetween('done_at', [$startDate, $endDate])
                ->get(['id', 'title', 'created_at', 'done_at']);
        }
    
       
        $ticketTitles = [];
        foreach ($tickets as $ticket) {
            $ticketTitles[$ticket->title] = true;
        }
        $ticketTitles = array_keys($ticketTitles);
    
     
        $groupedByDate = [];
        foreach ($tickets as $ticket) {
            $doneAt = \Carbon\Carbon::parse($ticket->done_at);
            $createdAt = $ticket->created_at;
            $date = $doneAt->format('Y-m-d');
            $duration = abs($doneAt->diffInHours($createdAt));
            
            if (!isset($groupedByDate[$date])) {
                $groupedByDate[$date] = [];
            }
            $groupedByDate[$date][$ticket->title] = $duration;
        }
    
       
        $chartData = [];
        foreach ($groupedByDate as $date => $ticketData) {
            $dayData = ['date' => $date];
            
          
            foreach ($ticketTitles as $title) {
                $dayData[$title] = $ticketData[$title] ?? 0;
            }
            
            $chartData[] = $dayData;
        }
    
        return response()->json($chartData);
    }


    
}
