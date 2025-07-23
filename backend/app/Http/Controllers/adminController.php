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
        $users = User::select('id', 'name','email')->get();
        return response()->json($users);
    }



    public function grantAdmin(Request $request){

        $user =$request->user();
        if($user->hasRole('admin')){
            User::findorfail($request->id)->assignRole('admin');
            return response()->json(['message' => 'Admin granted successfully']);



        }else{
        return response()->json(['error' => 'Non autorisé'], 403);


    }}

}
