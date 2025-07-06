<?php

namespace Database\Seeders;

use App\Models\UserModel;
use App\Models\TaskModel;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TaskSeeder::class
        ]);
        // UserModel::factory(10)->create();
        // UserModel::factory()->create([
        //     'name' => 'Test User',
        //     'email' => '
    }
}
