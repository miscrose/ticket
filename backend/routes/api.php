<?php

use App\Http\Controllers\adminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ticketcommentsController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/test', function () {
    return response()->json(['message' => 'test']);
});


Route::middleware('auth:api')->group(function () {
    Route::post('/store', [TicketController::class, 'store']);
    Route::get('/show_ticket', [TicketController::class, 'show_ticket']);
    Route::get('/show_tickets_paginated', [TicketController::class, 'show_tickets_paginated']);
    Route::put('/ticket_status_update/{id}', [TicketController::class, 'ticket_status_update']);

     Route::get('/allUsers', [adminController::class, 'allUsers']);
     Route::put('/user/{userId}/role', [adminController::class, 'updateUserRole']);
     Route::put('/user/{userId}', [adminController::class, 'updateUser']);
     Route::delete('/user/{userId}', [adminController::class, 'deleteUser']);
     Route::put('/profile', [AuthController::class, 'profile']);
     Route::get('/dashboard/countTicket', [DashboardController::class, 'countTicketByPeriod']);
     Route::get('/dashboard/doneTicketsDetailsPerDay', [DashboardController::class, 'doneTicketsDetailsPerDay']);
    Route::put('/tickets/update/{id}', [TicketController::class, 'update']);
    Route::get('/tickets/{id}/export-pdf', [TicketController::class, 'exportTicketPDF']);

   
    Route::post('/ticket-comments', [ticketcommentsController::class, 'store']);
    Route::get('/tickets/{ticket}/comments', [ticketcommentsController::class, 'index']);


    });

    






