<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Report;
use App\Models\ReportSubmission;
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
        ]);

          // 2. Seed users WITH roles (via factory states)
        User::factory()->count(50)->focalPerson()->create();
        User::factory()->count(50)->fieldOfficer()->create();

        Program::factory(100)->create();
        Report::factory(10)->create();
        ReportSubmission::factory(1000)->create();

    }
}
