<?php

namespace Database\Factories;

use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ReportSubmissionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'report_id' => Report::inRandomOrder()->value('id'),
            'field_officer_id' => 1, 
            'status' => $this->faker->randomElement(['draft', 'submitted']),
            'focal_preview_status' => $this->faker->randomElement(['accepted', 'rejected']),
            'remarks' => $this->faker->optional()->sentence(),
            'data' => $this->faker->randomElement([
                null,
                ['field1' => $this->faker->text(20), 'field2' => $this->faker->text(30)],
            ]),
        ];
    }
}
