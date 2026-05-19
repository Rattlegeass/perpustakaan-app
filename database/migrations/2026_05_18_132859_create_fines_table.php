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
        Schema::create('fines', function (Blueprint $table) {
            $table->id();

            $table->foreignId('borrowing_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->integer('late_days')->default(0);

            $table->decimal('total_fine', 12, 2)
                ->default(0);

            $table->enum('payment_status', [
                'unpaid',
                'paid'
            ])->default('unpaid');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fines');
    }
};
