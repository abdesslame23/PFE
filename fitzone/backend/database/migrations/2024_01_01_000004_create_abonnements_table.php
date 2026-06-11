<?php
// 2024_01_01_000004_create_abonnements_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('abonnements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->decimal('montant', 8, 2)->default(350.00);
            $table->enum('statut', ['actif', 'expire', 'suspendu'])->default('actif');
            $table->timestamps();
        });

        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('mois'); // 1-12
            $table->integer('annee');
            $table->decimal('montant', 8, 2)->default(350.00);
            $table->enum('statut', ['paye', 'impaye', 'en_attente'])->default('impaye');
            $table->date('date_paiement')->nullable();
            $table->string('methode')->nullable(); // especes, virement, carte
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('visites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cours_id')->nullable()->constrained('cours')->onDelete('set null');
            $table->datetime('date_visite');
            $table->enum('type', ['libre', 'cours'])->default('libre');
            $table->timestamps();
        });

        Schema::create('cours_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cours_id')->constrained()->onDelete('cascade');
            $table->enum('statut', ['inscrit', 'present', 'absent'])->default('inscrit');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('cours_user');
        Schema::dropIfExists('visites');
        Schema::dropIfExists('paiements');
        Schema::dropIfExists('abonnements');
    }
};
