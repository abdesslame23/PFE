<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Visite extends Model {
    protected $fillable = ['user_id','cours_id','date_visite','type'];
    protected $casts = ['date_visite' => 'datetime'];
    public function user() { return $this->belongsTo(User::class); }
    public function cours() { return $this->belongsTo(Cours::class); }
}
