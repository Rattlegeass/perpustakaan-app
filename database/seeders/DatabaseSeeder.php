<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Buku;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
            'no_telp' => '081234567890',
            'no_identitas' => '1234567890',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'member',
            'email' => 'member@gmail.com',
            'password' => bcrypt('password'),
            'no_telp' => '081234567890',
            'no_identitas' => '1234567890',
        ]);

        Buku::factory()->create([
            'judul' => 'Bulan',
            'penulis' => 'Tere Liye',
            'penerbit' => 'Gramedia Pustaka Utama',
            'tahun_terbit' => 2019,
            'stok' => 10,
            'kategori' => 'fiksi',
            'sinopsis' => 'Bulan adalah sebuah novel fiksi ilmiah yang menceritakan tentang seorang anak bernama Raib yang memiliki kemampuan istimewa. Dalam petualangannya di kehidupan paralel, Raib belajar tentang arti persahabatan, keberanian, dan tanggung jawab. Cerita yang memikat dengan fantasi yang indah dan pesan moral yang mendalam.',
        ]);

        Buku::factory()->create([
            'judul' => 'Laskar Pelangi',
            'penulis' => 'Andrea Hirata',
            'penerbit' => 'Bentang Pustaka',
            'tahun_terbit' => 2005,
            'stok' => 1,
            'kategori' => 'fiksi',
            'sinopsis' => 'Laskar Pelangi adalah kisah inspiratif tentang sepuluh anak muda dari keluarga yang kurang mampu di Belitung. Dengan determinasi dan semangat yang luar biasa, mereka berjuang mengenyam pendidikan meski penuh keterbatasan. Novel ini mengajarkan tentang kekuatan mimpi dan pentingnya pendidikan dalam mengubah nasib.',
        ]);

        Buku::factory()->create([
            'judul' => 'Filosofi Teras',
            'penulis' => 'Henry Manampiring',
            'penerbit' => 'Gramedia Pustaka Utama',
            'tahun_terbit' => 2019,
            'stok' => 8,
            'kategori' => 'non-fiksi',
            'sinopsis' => 'Filosofi Teras menggabungkan kebijaksanaan Stoisme kuno dengan kehidupan modern. Buku ini mengajarkan cara menghadapi tantangan hidup dengan tenang dan bijak, serta bagaimana menemukan kebahagiaan sejati melalui pemahaman diri yang lebih dalam. Cocok untuk mereka yang mencari kedamaian batin.',
        ]);
    }
}
