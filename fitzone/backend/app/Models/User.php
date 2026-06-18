<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nom', 'prenom', 'email', 'telephone', 'password',
        'role', 'photo', 'date_naissance', 'sexe',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function getJWTIdentifier() { return $this->getKey(); }
    public function getJWTCustomClaims() { return []; }

    public function isAdmin(): bool { return $this->role === 'admin'; }

    public function abonnements() { return $this->hasMany(Abonnement::class); }
    public function paiements() { return $this->hasMany(Paiement::class); }
    public function visites() { return $this->hasMany(Visite::class); }
    public function cours() { return $this->belongsToMany(Cours::class, 'cours_user')->withPivot('statut')->withTimestamps(); }

    /**
     * Calcule le vrai statut d'abonnement basé sur les paiements mensuels.
     *
     * Retourne un tableau avec :
     *   - statut        : 'actif' | 'derniere_chance' | 'inactif'
     *   - date_fin      : date de fin (fin du dernier mois consécutif payé)
     *   - message       : message lisible à afficher
     */
    public function getStatutAbonnement(): array
    {
        $now           = now();
        $moisActuel    = (int) $now->month;
        $anneeActuelle = (int) $now->year;
        $jourActuel    = (int) $now->day;
        $gracePeriod   = 5; // jours de grâce en début de mois

        // ── 1. Récupérer tous les paiements payés de l'utilisateur ──────────
        $paiementsPayes = $this->paiements()
            ->where('statut', 'paye')
            ->orderBy('annee', 'desc')
            ->orderBy('mois', 'desc')
            ->get()
            ->keyBy(fn($p) => $p->annee . '-' . str_pad($p->mois, 2, '0', STR_PAD_LEFT));

        // ── 2. Aucun paiement → INACTIF ─────────────────────────────────────
        if ($paiementsPayes->isEmpty()) {
            return [
                'statut'   => 'inactif',
                'date_fin' => null,
                'message'  => 'Aucun paiement enregistré',
            ];
        }

        // Helper : vérifie si un mois/année est payé
        $estPaye = fn(int $m, int $a) =>
            $paiementsPayes->has($a . '-' . str_pad($m, 2, '0', STR_PAD_LEFT));

        // ── 3. Mois actuel payé → avancer pour trouver le dernier mois payé ─
        if ($estPaye($moisActuel, $anneeActuelle)) {
            // Scanner en avant jusqu'au dernier mois consécutif payé
            $moisFin   = $moisActuel;
            $anneeFin  = $anneeActuelle;

            while (true) {
                $prochainMois   = $moisFin === 12 ? 1 : $moisFin + 1;
                $prochaineAnnee = $moisFin === 12 ? $anneeFin + 1 : $anneeFin;

                if ($estPaye($prochainMois, $prochaineAnnee)) {
                    $moisFin  = $prochainMois;
                    $anneeFin = $prochaineAnnee;
                } else {
                    break;
                }
            }

            $dateFin = \Carbon\Carbon::create($anneeFin, $moisFin, 1)->endOfMonth();
            return [
                'statut'   => 'actif',
                'date_fin' => $dateFin->toDateString(),
                'message'  => 'Expire le ' . $dateFin->format('d/m/Y'),
            ];
        }

        // ── 4. Mois actuel NON payé → vérifier période de grâce ─────────────
        if ($jourActuel <= $gracePeriod) {
            $moisPrec  = $moisActuel === 1 ? 12 : $moisActuel - 1;
            $anneePrec = $moisActuel === 1 ? $anneeActuelle - 1 : $anneeActuelle;

            if ($estPaye($moisPrec, $anneePrec)) {
                $dateFin = \Carbon\Carbon::create($anneePrec, $moisPrec, 1)->endOfMonth();
                return [
                    'statut'   => 'derniere_chance',
                    'date_fin' => $dateFin->toDateString(),
                    'message'  => 'Dernière chance — paiement dû',
                ];
            }
        }

        // ── 5. Hors période de grâce et mois impayé → INACTIF ───────────────
        // Trouver le dernier mois payé (déjà trié desc)
        $dernierPaiement = $paiementsPayes->first();
        [$anneeD, $moisD] = explode('-', $paiementsPayes->keys()->first());
        $dateFin = \Carbon\Carbon::create((int)$anneeD, (int)$moisD, 1)->endOfMonth();

        return [
            'statut'   => 'inactif',
            'date_fin' => $dateFin->toDateString(),
            'message'  => 'Expiré le ' . $dateFin->format('d/m/Y'),
        ];
    }

    // Alias backward-compat (non utilisé mais conservé)
    public function abonnementActif()
    {
        return null;
    }

    /**
     * Détermine le prochain mois à payer pour l'abonné.
     */
    public function getProchainMoisAPayer(): ?array
    {
        $now = now();
        $currentMonth = (int)$now->month;
        $currentYear = (int)$now->year;

        $created = $this->created_at ?? now();
        $userDebutYear = (int)$created->year;
        $userDebutMonth = (int)$created->month;

        // Récupérer le tout premier paiement pour ajuster le début si nécessaire
        $premierPaiement = $this->paiements()
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

        // Récupérer tous les paiements payés
        $paiementsPayes = $this->paiements()
            ->where('statut', 'paye')
            ->get()
            ->keyBy(fn($p) => $p->annee . '-' . str_pad($p->mois, 2, '0', STR_PAD_LEFT));

        $estPaye = fn(int $m, int $a) =>
            $paiementsPayes->has($a . '-' . str_pad($m, 2, '0', STR_PAD_LEFT));

        // 1. Parcourir depuis la date de début jusqu'au mois actuel pour trouver le premier impayé
        $y = $userDebutYear;
        $m = $userDebutMonth;
        while ($y < $currentYear || ($y === $currentYear && $m <= $currentMonth)) {
            if (!$estPaye($m, $y)) {
                return [
                    'mois' => $m,
                    'annee' => $y,
                    'nom' => $this->getNomMoisFr($m),
                ];
            }
            $m++;
            if ($m > 12) {
                $m = 1;
                $y++;
            }
        }

        // 2. Si tout est payé jusqu'au mois actuel, trouver le prochain mois après le dernier mois consécutif payé
        $y = $currentYear;
        $m = $currentMonth;
        while (true) {
            $prochainMois   = $m === 12 ? 1 : $m + 1;
            $prochaineAnnee = $m === 12 ? $y + 1 : $y;

            if ($estPaye($prochainMois, $prochaineAnnee)) {
                $m = $prochainMois;
                $y = $prochaineAnnee;
            } else {
                break;
            }
        }

        $suivMois = $m === 12 ? 1 : $m + 1;
        $suivAnnee = $m === 12 ? $y + 1 : $y;

        return [
            'mois' => $suivMois,
            'annee' => $suivAnnee,
            'nom' => $this->getNomMoisFr($suivMois),
        ];
    }

    private function getNomMoisFr(int $m): string
    {
        $moisList = [
            1 => 'Janvier', 2 => 'Février', 3 => 'Mars', 4 => 'Avril',
            5 => 'Mai', 6 => 'Juin', 7 => 'Juillet', 8 => 'Août',
            9 => 'Septembre', 10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre'
        ];
        return $moisList[$m] ?? '';
    }


    public function getNomCompletAttribute(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }
}
