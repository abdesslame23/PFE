<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CoursController extends Controller
{
    public function index(Request $request)
    {
        $query = Cours::with('salle')->where('actif', true);

        if ($request->filled('type'))  $query->where('type', $request->type);
        if ($request->filled('date'))  $query->whereDate('date', $request->date);
        if ($request->filled('salle')) $query->where('salle_id', $request->salle);

        $cours = $query->orderBy('date')->orderBy('heure_debut')->get();

        return response()->json($cours->map(fn($c) => array_merge($c->toArray(), [
            'places_disponibles' => $c->places_disponibles,
        ])));
    }

    public function show($id)
    {
        $cours = Cours::with(['salle', 'abonnes'])->findOrFail($id);
        return response()->json(array_merge($cours->toArray(), ['places_disponibles' => $cours->places_disponibles]));
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'titre'       => 'required|string|max:100',
            'type'        => 'required|in:boxe,mma,kickboxing,judo,jjb,autre',
            'salle_id'    => 'required|exists:salles,id',
            'coach'       => 'required|string|max:100',
            'date'        => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin'   => 'required|date_format:H:i|after:heure_debut',
            'places_max'  => 'required|integer|min:1',
            'niveau'      => 'in:debutant,intermediaire,avance,tous',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $cours = Cours::create($request->all());
        $cours->load('salle');
        return response()->json($cours, 201);
    }

    public function update(Request $request, $id)
    {
        $cours = Cours::findOrFail($id);
        $cours->update($request->all());
        $cours->load('salle');
        return response()->json($cours);
    }

    public function destroy($id)
    {
        Cours::findOrFail($id)->delete();
        return response()->json(['message' => 'Cours supprimé']);
    }

    public function inscrire($id)
    {
        $cours = Cours::findOrFail($id);
        $user = auth()->user();

        if ($cours->places_disponibles <= 0)
            return response()->json(['message' => 'Plus de places disponibles'], 400);

        if ($cours->abonnes()->where('user_id', $user->id)->exists())
            return response()->json(['message' => 'Déjà inscrit à ce cours'], 400);

        $cours->abonnes()->attach($user->id, ['statut' => 'inscrit']);
        $cours->increment('places_reservees');

        return response()->json(['message' => 'Inscription confirmée']);
    }

    public function desinscrire($id)
    {
        $cours = Cours::findOrFail($id);
        $user = auth()->user();

        $cours->abonnes()->detach($user->id);
        $cours->decrement('places_reservees');

        return response()->json(['message' => 'Désinscription effectuée']);
    }
}
