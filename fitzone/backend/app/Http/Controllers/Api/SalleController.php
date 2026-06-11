<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    public function index() { return response()->json(Salle::with('cours')->get()); }

    public function show($id) { return response()->json(Salle::with('cours')->findOrFail($id)); }

    public function store(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string|max:100',
            'capacite' => 'required|integer|min:1',
        ]);
        return response()->json(Salle::create($request->all()), 201);
    }

    public function update(Request $request, $id)
    {
        $salle = Salle::findOrFail($id);
        $salle->update($request->all());
        return response()->json($salle);
    }

    public function destroy($id)
    {
        Salle::findOrFail($id)->delete();
        return response()->json(['message' => 'Salle supprimée']);
    }
}
