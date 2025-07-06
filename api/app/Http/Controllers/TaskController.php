<?php

namespace App\Http\Controllers;

use App\Models\TaskModel;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = TaskModel::all();
        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(TaskRequest $request)
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        TaskModel::create([
            'title' =>  $request->input('title', 'Default Task Title'),
            'completed' => false
        ]);

        return response()->json(['message' => 'Task created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
