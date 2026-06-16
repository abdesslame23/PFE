<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'qr_token')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('qr_token')->nullable()->unique()->after('role');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'qr_token')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('qr_token');
            });
        }
    }
};
