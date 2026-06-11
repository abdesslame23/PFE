<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Abonnement;
use App\Models\Visite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AbonneController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'abonne')->withCount('visites');
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('nom','like',"%$s%")->orWhere('prenom','like',"%$s%")->orWhere('email','like',"%$s%"));
        }
        return response()->json($query->latest()->paginate(20));
    }

    public function show($id)
    {
        $user = User::with(['abonnements','paiements','visites.cours'])->withCount('visites')->findOrFail($id);
        $user->abonnement_actif = $user->abonnementActif();
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users',
            'telephone' => 'nullable|string|max:20',
            'password'  => 'required|string|min:6',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = User::create([
            'nom'      => $request->nom,
            'prenom'   => $request->prenom,
            'email'    => $request->email,
            'telephone'=> $request->telephone,
            'password' => Hash::make($request->password),
            'role'     => 'abonne',
        ]);
        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->only('nom','prenom','email','telephone','sexe','date_naissance');
        if ($request->filled('password')) $data['password'] = Hash::make($request->password);
        $user->update($data);
        return response()->json($user);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Abonné supprimé']);
    }

    public function ajouterVisite(Request $request, $id)
    {
        $visite = Visite::create([
            'user_id'     => $id,
            'cours_id'    => $request->cours_id,
            'date_visite' => $request->date_visite ?? now(),
            'type'        => $request->cours_id ? 'cours' : 'libre',
        ]);
        return response()->json($visite, 201);
    }

    public function stats()
    {
        return response()->json([
            'total_abonnes'    => User::where('role','abonne')->count(),
            'abonnes_actifs'   => Abonnement::where('statut','actif')->where('date_fin','>=',now())->distinct('user_id')->count(),
            'visites_ce_mois'  => Visite::whereMonth('date_visite', now()->month)->count(),
            'revenus_ce_mois'  => \App\Models\Paiement::whereMonth('created_at', now()->month)->where('statut','paye')->sum('montant'),
        ]);
    }
}
