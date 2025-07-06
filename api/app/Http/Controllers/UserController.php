<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = UserModel::all();
        return response()->json($users);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // check if the mail has been provided
        if ($request->input('email') === null) {
            return response()->json(['message' => 'Email is required'], 400);
        }

        // check if the email is valid
        else {
            $checkEmail = UserModel::query()->where('email', $request->input('email'))->first();
            if ($checkEmail) {
                return response()->json(['message' => 'Email already exists'], 409);
            }
        }

        // check if the last name and first name have been provided
        if ($request->input('last_name') === null || $request->input('first_name') === null) {
            return response()->json(['message' => 'Last name and first name are required'], 400);
        }

        UserModel::create([
            'last_name' => $request->input('last_name'),
            'first_name' => $request->input('first_name'),
            'email'=> $request->input('email')
        ]);

        return response()->json(['message' => 'User created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserModel $user)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserModel $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, UserModel $user)
    {
        if (UserModel::find($request->id, $user->id)->exists()) {
            $user->update([
                'last_name' => $request->input('last_name', $user->last_name),
                'first_name' => $request->input('first_name', $user->first_name),
                'email' => $request->input('email', $user->email)
            ]);
            $user->save();

            return response()->json(['message'=> 'User modified successfully'], 200);
        }
        return response()->json(['message' => 'Not found'], 404);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
