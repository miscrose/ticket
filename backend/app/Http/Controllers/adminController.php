<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class adminController extends Controller
{

    public function allUsers(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole('admin')) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }
        $users = User::select('id', 'name')->get();
        return response()->json($users);
    }

}
