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

    public function updateUser(Request $request, $userId)
    {
        $user = $request->user();
        if (!$user->hasRole('admin')) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $userId,
            'role' => 'required|in:user,admin'
        ]);

        $targetUser = User::findOrFail($userId);
        
        $targetUser->update([
            'name' => $request->name,
            'email' => $request->email
        ]);

        $targetUser->syncRoles([$request->role]);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => [
                'id' => $targetUser->id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
                'role' => $targetUser->getRoleNames()->first()
            ]
        ]);
    }

    public function deleteUser(Request $request, $userId)
    {
        $user = $request->user();
        if (!$user->hasRole('admin')) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        if ($user->id == $userId) {
            return response()->json(['error' => 'Vous ne pouvez pas supprimer votre propre compte'], 400);
        }

        $targetUser = User::findOrFail($userId);
        $targetUser->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}
