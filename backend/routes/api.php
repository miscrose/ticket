<?php

use App\Http\Controllers\adminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/test', function () {
    return response()->json(['message' => 'test']);
});


Route::middleware('auth:api')->group(function () {
    Route::post('/store', [TicketController::class, 'store']);
    Route::get('/show_ticket', [TicketController::class, 'show_ticket']);
    Route::put('/ticket_status_update/{id}', [TicketController::class, 'ticket_status_update']);

     Route::get('/allUsers', [adminController::class, 'allUsers']);
     Route::post('/grantAdmin', [adminController::class, 'grantAdmin']);
     Route::put('/profile', [AuthController::class, 'profile']);

    Route::put('/tickets/update/{id}', [TicketController::class, 'update']);


    });

    






