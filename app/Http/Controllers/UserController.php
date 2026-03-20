<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
public function store(Request $request)
{
    $validated = $request->validate([
        // Avatar (not stored directly)
        'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

        // Employee Info
        'employee_code' => ['nullable', 'string', 'max:50'],

        // Personal Info
        'first_name' => ['required', 'string', 'max:255'],
        'middle_name' => ['nullable', 'string', 'max:255'],
        'last_name' => ['required', 'string', 'max:255'],
        'gender' => ['required', 'in:male,female'],
        'birthday' => ['nullable', 'date'],

        // Work Info
        'department' => ['required', 'string', 'max:255'],
        'position' => ['required', 'string', 'max:255'],
        'cluster' => ['required', 'string'],

        // Role (Spatie Permission)
        'role' => ['required', 'in:focal_person,field_officer,program_head,provincial_director'],

        // Account Info
        'email' => ['required', 'email', 'unique:users,email'],
        'password' => ['required', 'confirmed', 'min:8'],
    ]);

    // Build full name
    $validated['name'] = trim(
        $validated['first_name'] . ' ' .
        ($validated['middle_name'] ? $validated['middle_name'] . ' ' : '') .
        $validated['last_name']
    );

    // Hash password
    $validated['password'] = bcrypt($validated['password']);

    // REMOVE  avatar and role from data going into User::create
    $userData = collect($validated)->except(['avatar','role'])->toArray();

    // Create user (no avatar and no role column)
    $user = User::create($userData);

    // Assign role via Spatie Permission
    $user->assignRole($validated['role']);

    // Handle avatar upload using Media Library
    if ($request->hasFile('avatar')) {
        $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');
    }

    return redirect()->back()->with('success', 'User created successfully.');
}

public function update(Request $request, User $user)
{
    $validated = $request->validate([
        // Avatar
        'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

        // Employee Info
        'employee_code' => ['nullable', 'string', 'max:50'],

        // Personal Info
        'first_name'  => ['required', 'string', 'max:255'],
        'middle_name' => ['nullable', 'string', 'max:255'],
        'last_name'   => ['required', 'string', 'max:255'],
        'gender'      => ['required', 'in:male,female'],
        'birthday'    => ['nullable', 'date'],

        // Work Info
        'department' => ['required', 'string', 'max:255'],
        'position'   => ['required', 'string', 'max:255'],
        'cluster'    => ['required', 'string'],

        // Role
        'role' => ['required', 'in:focal_person,field_officer,program_head,provincial_director'],

        // Account — email must be unique except for the current user
        'email' => ['required', 'email', 'unique:users,email,' . $user->id],

        // Password is optional on update — only validated when provided
        'password' => ['nullable', 'confirmed', 'min:8'],
    ]);

    // Rebuild full name
    $validated['name'] = trim(
        $validated['first_name'] . ' ' .
        ($validated['middle_name'] ? $validated['middle_name'] . ' ' : '') .
        $validated['last_name']
    );

    // Only hash + set password when the field was actually filled
    if (!empty($validated['password'])) {
        $validated['password'] = bcrypt($validated['password']);
    } else {
        unset($validated['password']);
        unset($validated['password_confirmation']); // never stored, but clean up
    }

    // Extract fields not going into the users table
    $role   = $validated['role'];
    $avatar = $request->file('avatar');
    $userData = collect($validated)->except(['avatar', 'role'])->toArray();

    // Update user record
    $user->update($userData);

    // Sync role (removes old role, assigns new one)
    $user->syncRoles([$role]);

    // Replace avatar if a new file was uploaded
    if ($avatar) {
        $user->clearMediaCollection('avatar');
        $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');
    }

    return redirect()->back()->with('success', 'User updated successfully.');
}

public function deleteMultipleUsers(Request $request)
{

    $request->validate([
        'users_id' => 'required|array',
        'users_id.*' => 'integer|exists:users,id',
    ]);

    $users = User::whereIn('id', $request->users_id)->get();

    foreach ($users as $user) {
        $user->clearMediaCollection('avatar'); // remove avatar files
        $user->delete();
    }

    return redirect()->back()->with('success', count($users) . ' user(s) deleted successfully.');
}

}
