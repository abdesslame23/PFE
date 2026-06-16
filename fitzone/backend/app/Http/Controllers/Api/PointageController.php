<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Visite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PointageController extends Controller
{
    // Code 6 chiffres de l'abonné connecté
    public function monCode()
    {
        $user = Auth::user();

        // Générer un code 6 chiffres unique si pas encore fait
        if (!$user->qr_token) {
            do {
                $code = strval(rand(100000, 999999));
            } while (User::where('qr_token', $code)->exists());

            // Persist token without calling instance save() to avoid static analysis issues
            $user->qr_token = $code;
            User::where('id', $user->id)->update(['qr_token' => $code]);
        }

        return response()->json([
            'code'       => $user->qr_token,
            'nom_complet'=> $user->prenom . ' ' . $user->nom,
        ]);
    }

    // Admin tape le code → valide l'entrée
    public function validerCode(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $user = User::where('qr_token', trim($request->code))->first();

        if (!$user) {
            return response()->json(['message' => 'Code invalide'], 404);
        }

        // Déjà pointé aujourd'hui ?
        $dejaPointe = Visite::where('user_id', $user->id)
            ->whereDate('date_visite', today())
            ->exists();

        if ($dejaPointe) {
            return response()->json([
                'message'     => 'Déjà pointé aujourd\'hui',
                'deja_pointe' => true,
                'user'        => ['nom' => $user->prenom . ' ' . $user->nom],
            ]);
        }

        Visite::create([
            'user_id'     => $user->id,
            'date_visite' => now(),
            'type'        => 'libre',
        ]);

        return response()->json([
            'message'     => 'Entrée validée !',
            'deja_pointe' => false,
            'user'        => [
                'nom'       => $user->prenom . ' ' . $user->nom,
                'email'     => $user->email,
                'nb_visites'=> $user->visites()->count(),
            ],
        ], 201);
    }

    // Liste entrées du jour
    public function pointagesDuJour()
    {
        $visites = Visite::with('user')
            ->whereDate('date_visite', today())
            ->orderBy('date_visite', 'desc')
            ->get()
            ->map(fn($v) => [
                'id'    => $v->id,
                'heure' => $v->date_visite->format('H:i'),
                'nom'   => $v->user->prenom . ' ' . $v->user->nom,
                'email' => $v->user->email,
            ]);

        return response()->json([
            'date'    => today()->format('d/m/Y'),
            'total'   => $visites->count(),
            'visites' => $visites,
        ]);
    }
}