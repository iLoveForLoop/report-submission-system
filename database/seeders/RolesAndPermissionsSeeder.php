<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'field_officer',
            'focal_person',
            'program_head',
            'provincial_director',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $users = [
            [
                'name'  => 'Field Officer User',
                'email' => 'field.officer@dilg.gov.ph',
                'role'  => 'field_officer',
            ],
            [
                'name'  => 'Program Focal Person',
                'email' => 'focal.person@dilg.gov.ph',
                'role'  => 'focal_person',
            ],
            [
                'name'  => 'Program Head',
                'email' => 'program.head@dilg.gov.ph',
                'role'  => 'program_head',
            ],
            [
                'name'  => 'Provincial Director',
                'email' => 'provincial.director@dilg.gov.ph',
                'role'  => 'provincial_director',
            ],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make('password'), // change later
                ]
            );

            if (!$user->hasRole($data['role'])) {
                $user->syncRoles([$data['role']]);
            }
        }


    }
}