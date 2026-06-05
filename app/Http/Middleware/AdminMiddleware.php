<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle($request, Closure $next)
    {
        $user = auth()->user();
        if (!$user) {
            abort(403);
        }

        $role = $user->role;
        if ($role === 'admin') {
            return $next($request);
        }

        if ($role === 'petugas') {
            $routeName = $request->route() ? $request->route()->getName() : null;
            if (
                ($routeName && str_starts_with($routeName, 'members.')) ||
                $request->is('members*')
            ) {
                abort(403, 'Unauthorized action for petugas.');
            }
            return $next($request);
        }

        abort(403);
    }
}
