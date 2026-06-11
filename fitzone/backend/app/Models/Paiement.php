<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Paiement extends Model {
    protected $fillable = ['user_id','mois','annee','montant','statut','date_paiement','methode','notes'];
    protected $casts = ['date_paiement' => 'date'];
    public function user() { return $this->belongsTo(User::class); }
}
