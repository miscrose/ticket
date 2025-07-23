<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\AuthLoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\AuthSignupRequest;
use App\Models\User;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(AuthLoginRequest $request)
    {
        if (!$token = JWTAuth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user = JWTAuth::user();
        $role = $user->getRoleNames()->first(); 
        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user,
            'role' => $role,
        ]);
    }

    public function signup(AuthSignupRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $token = JWTAuth::fromUser($user);
        $user->assignRole('user');
        $role = $user->getRoleNames()->first();
        return response()->json([
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => $user,
            'role' => $role,
        ], 201);
    }

    public function me()
    {
        return response()->json(JWTAuth::user());
    }

    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Déconnexion réussie']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la déconnexion'], 500);
        }
    }


    public function profile(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:6',
    ]);

    if (isset($validated['name'])) {
        $user->name = $validated['name'];
    }
    if (isset($validated['email'])) {
        $user->email = $validated['email'];
    }
    if (!empty($validated['password'])) {
        $user->password = Hash::make($validated['password']);
    }

    $user->save();

    return response()->json([
        'message' => 'Profil mis à jour avec succès',
        'user' => $user,
    ]);
}
}
