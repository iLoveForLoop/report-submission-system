<?php

namespace Database\Factories;

use App\Models\Program;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),

            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),

            // pick a valid program
            'program_id' => 1,

            // pick a valid coordinator (user role = coordinator)
            'created_by' => 2,

            // deadlines
            'deadline' => $this->faker->dateTimeBetween('+1 week', '+1 month'),
            'final_deadline' => $this->faker->dateTimeBetween('+1 month', '+2 months'),

            // example schema
            'form_schema' => [
                'fields' => [
                    ['name' => 'field1', 'type' => 'text'],
                    ['name' => 'field2', 'type' => 'number'],
                ],
            ],

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
