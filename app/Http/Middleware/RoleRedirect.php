<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleRedirect
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if (! $request->user()) {
            return redirect()->route('login');
        }



        // if ($request->routeIs('dashboard.*')) {
        //     return $next($request);
        // }

        $user = $request->user();

        return match (true) {
            $user->hasRole('field_officer') =>
                redirect()->route('field-officer.dashboard'),

            $user->hasRole('focal_person') =>
                redirect()->route('focal-person.dashboard'),

            $user->hasRole('program_head') =>
                redirect()->route('program-head.dashboard'),

            $user->hasRole('provincial_director') =>
                redirect()->route('provincial-director.dashboard'),

            default => redirect()->route('dashboard')
        };
    }
}