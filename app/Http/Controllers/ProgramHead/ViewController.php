<?php

namespace App\Http\Controllers\ProgramHead;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\User;
use Illuminate\Http\Request;

class ViewController extends Controller
{
    public function dashboard(){
        return inertia('program-head/dashboard/page');
    }

    public function programs()
    {
        $programs = Program::with('coordinator')
                    ->get()
                    ->map(fn ($program) => [
                        'id' => $program->id,
                        'name' => $program->name,
                        'description' => $program->description,
                        'created_at' => $program->created_at->toISOString(),
                        'updated_at' => $program->updated_at->toISOString(),
                        'coordinator' => [
                            'id' => $program->coordinator->id,
                            'name' => $program->coordinator->name,
                            'email' => $program->coordinator->email,
                            'avatar' => $program->coordinator->avatar,
                            'email_verified_at' => $program->coordinator->email_verified_at,
                            'two_factor_enabled' => $program->coordinator->two_factor_enabled ?? false,
                            'created_at' => $program->coordinator->created_at->toISOString(),
                            'updated_at' => $program->coordinator->updated_at->toISOString(),
                            'role' => $program->coordinator->role,
                        ],
                    ]);

        $coordinators = User::role('focal_person')
                        ->select('id', 'name', 'email', 'avatar')
                        ->get();



        return inertia('program-head/programs/page', [
            'programs' => $programs,
            'coordinators' => $coordinators,
        ]);
    }

    public function reports(Program $program)
    {
        $reports = $program->load("reports");

        return inertia('program-head/programs/reports/page', [
            'program' => $program,
            'reports' => $reports->reports,
        ]);
    }

    public function manageUsers()
    {
           $users = User::query()
        ->select([
            'id',
            'employee_code',
            'first_name',
            'middle_name',
            'last_name',
            'gender',
            'department',
            'position',
            'birthday',
            'email',
            'email_verified_at',
            'created_at',
            'updated_at',
        ])
        ->with('media') // required for Spatie
        ->latest()
        ->paginate(10)
        ->through(fn (User $user) => [
            'id' => $user->id,
            'employee_code' => $user->employee_code,
            'name' => trim("{$user->first_name} {$user->last_name}"),
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'gender' => $user->gender,
            'department' => $user->department,
            'position' => $user->position,
            'birthday' => $user->birthday?->toDateString(),
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'avatar_url' => $user->getFirstMediaUrl('avatar'),
            'created_at' => $user->created_at->toISOString(),
            'updated_at' => $user->updated_at->toISOString(),
            'role' => $user->roles->pluck('name')->first(), // if using Spatie Roles
        ]);

    return inertia('program-head/manage-users/page', [
        'users' => $users,
    ]);
    }

}