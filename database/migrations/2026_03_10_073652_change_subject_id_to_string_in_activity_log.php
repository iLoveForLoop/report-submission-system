<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('activity_log')->truncate();

        Schema::table('activity_log', function (Blueprint $table) {
            $table->string('subject_id', 36)->nullable()->change();  // 36 = UUID length
            $table->string('causer_id', 36)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity_log', function (Blueprint $table) {
            $table->unsignedBigInteger('subject_id')->change();
            $table->unsignedBigInteger('causer_id')->change();
        });
    }
};
