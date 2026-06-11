<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $v = Validator::make($request->all(), [
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users',
            'telephone' => 'nullable|string|max:20',
            'password'  => 'required|string|min:6|confirmed',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = User::create([
            'nom'       => $request->nom,
            'prenom'    => $request->prenom,
            'email'     => $request->email,
            'telephone' => $request->telephone,
            'password'  => Hash::make($request->password),
            'role'      => 'abonne',
        ]);

        $token = JWTAuth::fromUser($user);
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }
        $user = auth()->user();
        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me()
    {
        $user = auth()->user();
        $user->load(['abonnements', 'paiements', 'visites']);
        $user->abonnement_actif = $user->abonnementActif();
        $user->nb_visites = $user->visites()->count();
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        $v = Validator::make($request->all(), [
            'nom'       => 'sometimes|string|max:100',
            'prenom'    => 'sometimes|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'password'  => 'nullable|string|min:6|confirmed',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $data = $request->only('nom', 'prenom', 'telephone');
        if ($request->filled('password')) $data['password'] = Hash::make($request->password);
        $user->update($data);
        return response()->json($user);
    }
}
