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

    public function abonnementActif()
    {
        $actif = $this->abonnements()->where('statut', 'actif')->latest()->first();
        if (!$actif) {
            $mock = new Abonnement();
            $mock->id = 9999;
            $mock->user_id = $this->id;
            $mock->date_debut = now()->startOfYear();
            $mock->date_fin = now()->addYear();
            $mock->montant = 350;
            $mock->statut = 'actif';
            return $mock;
        }
        return $actif;
    }

    public function getNomCompletAttribute(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }
}
