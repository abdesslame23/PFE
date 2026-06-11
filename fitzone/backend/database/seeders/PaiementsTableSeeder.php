<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Paiement;

class PaiementsTableSeeder extends Seeder
{
    public function run(): void
    {
        $abonnes = User::where('role', 'abonne')->get();

        foreach ($abonnes as $abonne) {
            for ($month = 1; $month <= 4; $month++) {
                Paiement::updateOrCreate([
                    'user_id' => $abonne->id,
                    'mois' => $month,
                    'annee' => 2026
                ], [
                    'montant' => 350.00,
                    'statut' => rand(0, 2) === 0 ? 'impaye' : (rand(0, 1) ? 'paye' : 'en_attente'),
                    'date_paiement' => rand(0, 1) ? now()->toDateString() : null,
                    'methode' => rand(0, 1) ? 'especes' : 'virement',
                ]);
            }
        }
    }
}
