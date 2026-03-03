<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        /**
         * ---------------------------------------------------------
         * Create Roles
         * ---------------------------------------------------------
         */
        $roles = [
            'field_officer',
            'focal_person',
            'program_head',
            'provincial_director',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        /**
         * -----------------------------------------------------        ----
         * Create Users
         * ---------------------------------------------------------
         */
        $users = [
            [
                'name'       => 'Field Officer User',
                'first_name' => 'Field',
                'last_name'  => 'Officer',
                'email'      => 'field.officer@dilg.gov.ph',
                'role'       => 'field_officer',
                'position'   => 'Field Officer',
            ],
            [
                'name'       => 'Program Focal Person',
                'first_name' => 'Program',
                'last_name'  => 'Focal',
                'email'      => 'focal.person@dilg.gov.ph',
                'role'       => 'focal_person',
                'position'   => 'Program Focal Person',
            ],
            [
                'name'       => 'Program Head',
                'first_name' => 'Program',
                'last_name'  => 'Head',
                'email'      => 'program.head@dilg.gov.ph',
                'role'       => 'program_head',
                'position'   => 'Program Head',
            ],
            [
                'name'       => '   ',
                'first_name' => 'Provincial',
                'last_name'  => 'Director',
                'email'      => 'provincial.director@dilg.gov.ph',
                'role'       => 'provincial_director',
                'position'   => 'Provincial Director',
            ],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'employee_code' => null,
                    'name'          => $data['name'],
                    'first_name'    => $data['first_name'],
                    'middle_name'   => null,
                    'last_name'     => $data['last_name'],
                    'gender'        => 'Male',          // adjust if needed
                    'department'    => 'DILG',
                    'position'      => $data['position'],
                    'birthday'      => null,
                    'password'      => Hash::make('password'),
                ]
            );

            // Ensure correct role assignment
            if (!$user->hasRole($data['role'])) {
                $user->syncRoles([$data['role']]);
            }
        }
    }
}