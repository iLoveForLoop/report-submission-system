<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
{
    $firstName = fake()->firstName();
    $lastName  = fake()->lastName();

    return [
        'employee_code' => 'EMP-' . fake()->unique()->numberBetween(1000, 9999),
        'name'          => "{$firstName} {$lastName}",
        'first_name'    => $firstName,
        'middle_name'   => null,
        'last_name'     => $lastName,

        'gender'     => fake()->randomElement(['Male', 'Female']),
        'department' => 'DILG',
        'position'   => fake()->randomElement([
            'Program Focal Person',
            'Field Officer',
        ]),
        'birthday' => fake()->optional()->date(),

        'email'             => fake()->unique()->safeEmail(),
        'email_verified_at' => now(),
        'password'          => static::$password ??= Hash::make('password'),
        'remember_token'    => Str::random(10),
    ];
}


    /**
     * ----------------------------
     * Role States
     * ----------------------------
     */

    public function focalPerson(): static
    {
        return $this->state(fn () => [
            'position' => 'Program Focal Person',
        ])->afterCreating(function (User $user) {
            $user->syncRoles(['focal_person']);
        });
    }

    public function fieldOfficer(): static
    {
        return $this->state(fn () => [
            'position' => 'Field Officer',
        ])->afterCreating(function (User $user) {
            $user->syncRoles(['field_officer']);
        });
    }

    /**
     * Email not verified
     */
    public function unverified(): static
    {
        return $this->state(fn () => [
            'email_verified_at' => null,
        ]);
    }
}
