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
        ]);

        Buku::factory()->create([
            'judul' => 'Laskar Pelangi',
            'penulis' => 'Andrea Hirata',
            'penerbit' => 'Bentang Pustaka',
            'tahun_terbit' => 2005,
            'stok' => 5,
            'kategori' => 'fiksi',
        ]);

        Buku::factory()->create([
            'judul' => 'Filosofi Teras',
            'penulis' => 'Henry Manampiring',
            'penerbit' => 'Gramedia Pustaka Utama',
            'tahun_terbit' => 2019,
            'stok' => 8,
        ]);
    }
}
