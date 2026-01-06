<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            RolesAndPermissionsSeeder::class, 
            ClusterSeeder::class
        ]);

          // 2. Seed users WITH roles (via factory states)
        User::factory()->count(50)->focalPerson()->create();
        User::factory()->count(50)->fieldOfficer()->create();

    }
}
