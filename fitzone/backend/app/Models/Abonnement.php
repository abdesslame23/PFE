<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Abonnement extends Model {
    protected $fillable = ['user_id','date_debut','date_fin','montant','statut'];
    protected $casts = ['date_debut' => 'date', 'date_fin' => 'date'];
    public function user() { return $this->belongsTo(User::class); }
}
