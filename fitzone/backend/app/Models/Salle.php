<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Salle extends Model {
    protected $fillable = ['nom','description','capacite','equipements','actif'];
    protected $casts = ['actif' => 'boolean'];
    public function cours() { return $this->hasMany(Cours::class); }
}
