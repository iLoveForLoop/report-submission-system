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

}