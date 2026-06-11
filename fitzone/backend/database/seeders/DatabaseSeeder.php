<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Salle;
use App\Models\Cours;
use App\Models\Paiement;
use App\Models\Abonnement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::create([
            'nom' => 'Admin', 'prenom' => 'FitZone',
            'email' => 'admin@fitzone.ma',
            'password' => Hash::make('admin123'),
            'role' => 'admin', 'telephone' => '+212600000000',
        ]);

        // Abonnés exemple
        $abonne = User::create([
            'nom' => 'Karimi', 'prenom' => 'Amine',
            'email' => 'amine@fitzone.ma',
            'password' => Hash::make('password'),
            'role' => 'abonne', 'telephone' => '+212661234567',
        ]);

        // Salles
        $salleA = Salle::create(['nom' => 'Salle A – Ring', 'capacite' => 15, 'equipements' => 'Ring boxe, sacs de frappe, cordes', 'description' => 'Salle principale dédiée aux arts martiaux debout']);
        $salleB = Salle::create(['nom' => 'Salle B – Octogone', 'capacite' => 15, 'equipements' => 'Cage MMA, tatamis, sacs de frappe', 'description' => 'Salle MMA avec cage professionnelle']);
        $salleC = Salle::create(['nom' => 'Salle C – Tatami', 'capacite' => 20, 'equipements' => 'Tatamis sol complet, miroirs', 'description' => 'Salle grappling et arts martiaux au sol']);

        // Cours
        $jours = ['2025-04-14','2025-04-15','2025-04-16','2025-04-17','2025-04-18','2025-04-19'];
        Cours::create(['titre'=>'Boxe Anglaise','type'=>'boxe','salle_id'=>$salleA->id,'coach'=>'Coach Rachid','date'=>$jours[0],'heure_debut'=>'18:00','heure_fin'=>'19:30','places_max'=>15,'places_reservees'=>8,'niveau'=>'tous']);
        Cours::create(['titre'=>'MMA Avancé','type'=>'mma','salle_id'=>$salleB->id,'coach'=>'Coach Yassine','date'=>$jours[1],'heure_debut'=>'19:00','heure_fin'=>'20:30','places_max'=>15,'places_reservees'=>12,'niveau'=>'avance']);
        Cours::create(['titre'=>'Kickboxing','type'=>'kickboxing','salle_id'=>$salleA->id,'coach'=>'Coach Imane','date'=>$jours[2],'heure_debut'=>'17:30','heure_fin'=>'19:00','places_max'=>12,'places_reservees'=>5,'niveau'=>'intermediaire']);
        Cours::create(['titre'=>'Judo','type'=>'judo','salle_id'=>$salleC->id,'coach'=>'Coach Karim','date'=>$jours[3],'heure_debut'=>'16:00','heure_fin'=>'17:30','places_max'=>20,'places_reservees'=>10,'niveau'=>'tous']);
        Cours::create(['titre'=>'JJB Gi','type'=>'jjb','salle_id'=>$salleC->id,'coach'=>'Coach Sara','date'=>$jours[4],'heure_debut'=>'18:30','heure_fin'=>'20:00','places_max'=>12,'places_reservees'=>7,'niveau'=>'debutant']);

        // Abonnement
        Abonnement::create(['user_id'=>$abonne->id,'date_debut'=>'2025-01-01','date_fin'=>'2025-12-31','montant'=>350,'statut'=>'actif']);

        // Paiements
        for ($m = 1; $m <= 2; $m++) {
            Paiement::create(['user_id'=>$abonne->id,'mois'=>$m,'annee'=>2025,'montant'=>350,'statut'=>'paye','date_paiement'=>"2025-0$m-05"]);
        }
        Paiement::create(['user_id'=>$abonne->id,'mois'=>3,'annee'=>2025,'montant'=>350,'statut'=>'impaye']);
        Paiement::create(['user_id'=>$abonne->id,'mois'=>4,'annee'=>2025,'montant'=>350,'statut'=>'impaye']);
    }
}
