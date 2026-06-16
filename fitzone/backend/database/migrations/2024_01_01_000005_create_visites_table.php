<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('visites')) {
            Schema::create('visites', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('cours_id')->nullable()->constrained('cours')->onDelete('set null');
                $table->datetime('date_visite');
                $table->enum('type', ['libre', 'cours'])->default('libre');
                $table->timestamps();
            });
        }

        if (!Schema::hasColumn('users', 'qr_token')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('qr_token')->nullable()->unique()->after('role');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('visites')) {
            Schema::dropIfExists('visites');
        }

        if (Schema::hasColumn('users', 'qr_token')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('qr_token');
            });
        }
    }
};
