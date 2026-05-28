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
        Schema::create('peminjamans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('tgl_peminjaman')->nullable();  // Nullable - set saat member ambil buku
            $table->date('batas_tgl_peminjaman')->nullable();  // Nullable - set saat member ambil buku (tgl_peminjaman + 7 hari)
            $table->enum('status_peminjaman', ['menunggu_persetujuan', 'menunggu_pengambilan', 'dipinjam', 'dikembalikan', 'terlambat'])->default('menunggu_persetujuan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjamans');
    }
};
