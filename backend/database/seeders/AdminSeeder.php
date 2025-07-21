<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $adminUser = User::firstOrCreate(
            ['email' => 'w@w'], // <-- Mets ton email ici
            [
                'name' => 'w',
                'password' => bcrypt('123456789') // <-- Mets ton mot de passe ici
            ]
        );

        // Assigner le rôle admin à cet utilisateur
        $adminUser->assignRole($adminRole);
    }
}
