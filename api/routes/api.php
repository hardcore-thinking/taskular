<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;

Route::get('/user', function (Request $request) {
    return response("test", 200);
});


