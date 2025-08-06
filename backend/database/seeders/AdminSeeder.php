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
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'api',
        ]);

        $userRole = Role::firstOrCreate([
            'name' => 'user',
            'guard_name' => 'api',
        ]);
        $adminUser = User::firstOrCreate(
            ['email' => 'w@w'], 
            [
                'name' => 'w',
                'password' => bcrypt('123456789') 
            ]
        );

       
        $adminUser->assignRole($adminRole);
    }
}
