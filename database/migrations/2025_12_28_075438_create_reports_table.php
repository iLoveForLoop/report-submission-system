<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('title');
                $table->text('description')->nullable();
                $table->unsignedBigInteger('program_id');
                $table->unsignedBigInteger('created_by'); // coordinator
                $table->date('deadline');
                $table->date('final_deadline')->nullable();
                $table->timestamps();

                $table->foreign('program_id')
                ->references('id')->on('programs')
                ->onDelete('cascade');

                $table->foreign('created_by')
                ->references('id')->on('users')
                                                                                                ->onDelete('cascade');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
