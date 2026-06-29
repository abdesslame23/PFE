<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    // GET /paiements?user_id=X  ou mes paiements si abonné
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Paiement::with('user');

        if ($user->isAdmin() && $request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        } elseif (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('annee')) $query->where('annee', $request->annee);
        if ($request->filled('statut')) $query->where('statut', $request->statut);

        return response()->json($query->orderBy('annee','desc')->orderBy('mois','desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'mois'    => 'required|integer|between:1,12',
            'annee'   => 'required|integer|min:2020',
            'montant' => 'required|numeric|min:0',
            'statut'  => 'in:paye,impaye,en_attente',
        ]);
        $paiement = Paiement::create($request->all());
        return response()->json($paiement, 201);
    }

    public function marquerPaye($id)
    {
        $paiement = Paiement::findOrFail($id);
        $paiement->update([
            'statut'        => 'paye',
            'date_paiement' => now()->toDateString(),
        ]);
        return response()->json($paiement);
    }

    // NOUVELLE METHODE: Marquer un paiement mensuel pour un abonné
    public function marquerPaiementMensuel(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'mois'    => 'required|integer|between:1,12',
            'annee'   => 'required|integer|min:2020',
            'statut'  => 'required|in:paye,impaye,en_attente',
            'methode' => 'nullable|string',
            'notes'   => 'nullable|string',
        ]);

        // Chercher le paiement existant ou en créer un nouveau
        $paiement = Paiement::where('user_id', $request->user_id)
                           ->where('mois', $request->mois)
                           ->where('annee', $request->annee)
                           ->first();

        if ($paiement) {
            // Mettre à jour le paiement existant
            $paiement->update([
                'statut' => $request->statut,
                'date_paiement' => $request->statut === 'paye' ? now()->toDateString() : null,
                'methode' => $request->methode,
                'notes' => $request->notes,
            ]);
        } else {
           
            $paiement = Paiement::create([
                'user_id' => $request->user_id,
                'mois' => $request->mois,
                'annee' => $request->annee,
                'montant' => 350.00, 
                'statut' => $request->statut,
                'date_paiement' => $request->statut === 'paye' ? now()->toDateString() : null,
                'methode' => $request->methode,
                'notes' => $request->notes,
            ]);
        }

        return response()->json($paiement->load('user'));
    }

    public function update(Request $request, $id)
    {
        $paiement = Paiement::findOrFail($id);
        $paiement->update($request->all());
        return response()->json($paiement);
    }

    public function destroy($id)
    {
        Paiement::findOrFail($id)->delete();
        return response()->json(['message' => 'Paiement supprimé']);
    }

    public function recapAnnuel(Request $request)
    {
        $user = auth()->user();
        $userId = ($user->isAdmin() && $request->filled('user_id')) ? $request->user_id : $user->id;
        $annee = (int)($request->annee ?? now()->year);

        $member = \App\Models\User::find($userId);
        if (!$member) {
            return response()->json([]);
        }

        // Déterminer le mois et l'année de début (inscription ou premier paiement)
        $created = $member->created_at ?? now();
        $userDebutYear = (int)$created->year;
        $userDebutMonth = (int)$created->month;

        $premierPaiement = Paiement::where('user_id', $userId)
            ->orderBy('annee', 'asc')
            ->orderBy('mois', 'asc')
            ->first();

        if ($premierPaiement) {
            $pYear = (int)$premierPaiement->annee;
            $pMonth = (int)$premierPaiement->mois;
            if ($pYear < $userDebutYear || ($pYear === $userDebutYear && $pMonth < $userDebutMonth)) {
                $userDebutYear = $pYear;
                $userDebutMonth = $pMonth;
            }
        }

        // Si l'année demandée est antérieure à l'année de début
        if ($annee < $userDebutYear) {
            return response()->json([]);
        }

        $moisDebut = ($annee === $userDebutYear) ? $userDebutMonth : 1;

        // Déterminer le mois de fin
        $currentYear = (int)now()->year;
        if ($annee === $currentYear) {
            $moisFin = (int)now()->month;
            // Prendre en compte les paiements futurs payés de cette année
            $dernierPaiementDeLAnnee = Paiement::where('user_id', $userId)
                ->where('annee', $annee)
                ->where('statut', 'paye')
                ->orderBy('mois', 'desc')
                ->first();
            if ($dernierPaiementDeLAnnee && (int)$dernierPaiementDeLAnnee->mois > $moisFin) {
                $moisFin = (int)$dernierPaiementDeLAnnee->mois;
            }
        } elseif ($annee < $currentYear) {
            $moisFin = 12;
        } else {
            // Année future : uniquement les mois payés d'avance
            $dernierPaiementDeLAnnee = Paiement::where('user_id', $userId)
                ->where('annee', $annee)
                ->where('statut', 'paye')
                ->orderBy('mois', 'desc')
                ->first();
            if (!$dernierPaiementDeLAnnee) {
                return response()->json([]);
            }
            $moisFin = (int)$dernierPaiementDeLAnnee->mois;
        }

        $paiements = Paiement::where('user_id', $userId)
            ->where('annee', $annee)
            ->get()
            ->keyBy('mois');

        $mois = [];
        for ($m = $moisDebut; $m <= $moisFin; $m++) {
            $mois[] = $paiements->get($m) ?? [
                'mois' => $m,
                'annee' => $annee,
                'statut' => 'impaye',
                'montant' => 350
            ];
        }

        return response()->json($mois);
    }

    
    public function gestionPaiements(Request $request)
    {
        $annee = $request->annee ?? now()->year;
        $mois = $request->mois ?? now()->month;

        $users = \App\Models\User::where('role', 'abonne')
            ->with(['paiements' => function($query) use ($annee, $mois) {
                $query->where('annee', $annee)->where('mois', $mois);
            }])
            ->get()
            ->map(function($user) use ($annee, $mois) {
                $paiement = $user->paiements->first();
                return [
                    'id' => $user->id,
                    'nom_complet' => $user->nom_complet,
                    'email' => $user->email,
                    'telephone' => $user->telephone,
                    'paiement' => $paiement ? [
                        'id' => $paiement->id,
                        'statut' => $paiement->statut,
                        'montant' => $paiement->montant,
                        'date_paiement' => $paiement->date_paiement,
                        'methode' => $paiement->methode,
                        'notes' => $paiement->notes,
                    ] : null,
                    'mois' => $mois,
                    'annee' => $annee,
                ];
            });

        return response()->json($users);
    }

    public function validerAnneeEntiere(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'annee'   => 'required|integer|min:2020',
            'statut'  => 'required|in:paye,impaye',
            'methode' => 'nullable|string',
            'notes'   => 'nullable|string',
        ]);

        $userId = $request->user_id;
        $annee = $request->annee;
        $statut = $request->statut;
        $methode = $request->methode;
        $notes = $request->notes ?? 'Règlement Annuel';

        $paiements = [];
        for ($mois = 1; $mois <= 12; $mois++) {
            $paiement = Paiement::where('user_id', $userId)
                               ->where('mois', $mois)
                               ->where('annee', $annee)
                               ->first();

            if ($paiement) {
                $paiement->update([
                    'statut' => $statut,
                    'date_paiement' => $statut === 'paye' ? now()->toDateString() : null,
                    'methode' => $methode,
                    'notes' => $notes,
                ]);
            } else {
                $paiement = Paiement::create([
                    'user_id' => $userId,
                    'mois' => $mois,
                    'annee' => $annee,
                    'montant' => 350.00,
                    'statut' => $statut,
                    'date_paiement' => $statut === 'paye' ? now()->toDateString() : null,
                    'methode' => $methode,
                    'notes' => $notes,
                ]);
            }
            $paiements[] = $paiement;
        }

        return response()->json([
            'message' => 'Année entière validée.',
            'paiements' => $paiements
        ]);
    }
}
