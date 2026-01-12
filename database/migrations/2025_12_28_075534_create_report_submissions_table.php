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
        Schema::create('report_submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('report_id');
            $table->unsignedBigInteger('field_officer_id');
            $table->string('status')->default('draft'); // draft | submitted
            $table->enum('focal_preview_status',['accepted','rejected']);
            $table->text('remarks')->nullable();
            $table->json('data')->nullable();
            $table->timestamps();

            $table->foreign('report_id')
                ->references('id')->on('reports')
                ->onDelete('cascade');

            $table->foreign('field_officer_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_submissions');
    }
};