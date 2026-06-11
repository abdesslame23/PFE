<?php
// Cours.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $fillable = ['titre','type','salle_id','coach','date','heure_debut','heure_fin','places_max','places_reservees','description','niveau','actif'];
    protected $casts = ['date' => 'date', 'actif' => 'boolean'];

    public function salle() { return $this->belongsTo(Salle::class); }
    public function abonnes() { return $this->belongsToMany(User::class, 'cours_user')->withPivot('statut')->withTimestamps(); }
    public function visites() { return $this->hasMany(Visite::class); }

    public function getPlacesDisponiblesAttribute(): int
    {
        return max(0, $this->places_max - $this->places_reservees);
    }
}
