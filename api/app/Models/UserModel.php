<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserModel extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    protected $table = 'users';
    protected $fillable = [
        'id',
        'last_name',
        'first_name',
        'email',
        'created_at',
        'updated_at',
    ];
}
