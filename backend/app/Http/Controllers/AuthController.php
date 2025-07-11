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
        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => JWTAuth::user(),
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
        return response()->json([
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function me()
    {
        return response()->json(JWTAuth::user());
    }
}
