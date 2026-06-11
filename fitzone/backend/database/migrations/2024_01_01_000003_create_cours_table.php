<?php
// 2024_01_01_000003_create_cours_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->enum('type', ['boxe', 'mma', 'kickboxing', 'judo', 'jjb', 'autre']);
            $table->foreignId('salle_id')->constrained('salles')->onDelete('cascade');
            $table->string('coach');
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->integer('places_max');
            $table->integer('places_reservees')->default(0);
            $table->text('description')->nullable();
            $table->enum('niveau', ['debutant', 'intermediaire', 'avance', 'tous'])->default('tous');
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('cours'); }
};
