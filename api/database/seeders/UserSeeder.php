<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserModel;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        for ($i = 0; $i < 50; $i++) {
            UserModel::create([
                'last_name' => $faker->lastName,
                'first_name' => $faker->firstName,
                'email' => $faker->unique()->safeEmail,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
