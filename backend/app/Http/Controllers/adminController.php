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
        $users = User::all()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first() ?? 'user',
            ];
        });

        return response()->json($users);
    }



    public function updateUserRole(Request $request, $userId){
        $user = $request->user();
        if(!$user->hasRole('admin')){
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $targetUser = User::findOrFail($userId);
        $newRole = $request->newRole; 


        $targetUser->assignRole($newRole);


        return response()->json(['message' => 'Rôle mis à jour avec succès',  'role' => $newRole]);
    }





}
