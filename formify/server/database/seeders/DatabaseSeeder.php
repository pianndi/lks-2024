<?php

namespace Database\Seeders;

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
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'User 1',
            'email' => 'user1@webtech.id',
            'password'=> bcrypt('password1'),
        ]);
        User::factory()->create([
            'name' => 'User 2',
            'email' => 'user2@webtech.id',
            'password'=> bcrypt('password2'),
        ]);
        User::factory()->create([
            'name' => 'User 3',
            'email' => 'user3@worldskills.org',
            'password'=> bcrypt('password3'),
        ]);
    }
}
