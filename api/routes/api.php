<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;

$USER_ID_ROUTE = "/users/{id}";
$TASK_ID_ROUTE = "/tasks/{id}";

Route::get("/users", [UserController::class, 'index']);
Route::get($USER_ID_ROUTE, [UserController::class, 'show']);
Route::post("/users", [UserController::class, 'store']);
Route::put($USER_ID_ROUTE, [UserController::class, 'update']);
Route::delete($USER_ID_ROUTE, [UserController::class, 'destroy']);

Route::get("/tasks", [TaskController::class, 'index']);
Route::get($TASK_ID_ROUTE, [TaskController::class, 'show']);
Route::post("/tasks", [TaskController::class, 'store']);
Route::put($TASK_ID_ROUTE, [TaskController::class, 'update']);
Route::delete($TASK_ID_ROUTE, [TaskController::class, 'destroy']);
