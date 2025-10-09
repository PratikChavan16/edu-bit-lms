<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\University;
use App\Models\College;

class ResolveTenantContext
{
    /**
     * Resolve university and college context from domain/subdomain or headers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (app()->runningUnitTests() || app()->environment('testing')) {
            return $next($request);
        }

        $host = $request->getHost();

        // Try header-based tenant resolution first (for local dev / API clients)
        if ($request->hasHeader('X-Tenant-University')) {
            $universitySlug = $request->header('X-Tenant-University');
            $collegeSlug = $request->header('X-Tenant-College');

            $university = $this->resolveUniversityBySlug($universitySlug);
            $college = $collegeSlug && $university
                ? $this->resolveCollegeBySlug($university->id, $collegeSlug)
                : null;
        } elseif ($request->hasHeader('X-College-Id')) {
            $college = $this->resolveCollegeById($request->header('X-College-Id'));
            $university = $college?->university;
        } elseif ($request->query('college_id')) {
            $college = $this->resolveCollegeById((string) $request->query('college_id'));
            $university = $college?->university;
        } else {
            // Domain-based resolution (subdomain or custom domain)
            $university = $this->resolveUniversityByDomain($host);
            $college = $this->resolveCollegeBySubdomain($host, $university);
        }

        if (!$university || $university->status !== 'live') {
            if ($college && !$college->relationLoaded('university')) {
                $college->load('university');
            }

            if ($college && $college->university && $college->university->status === 'live') {
                $university = $college->university;
            } else {
                return $next($request);
            }
        }

        // Inject resolved tenant into request attributes
        $request->merge([
            '_tenant_university' => $university,
            '_tenant_college' => $college,
        ]);

        // Store in app container for global access
        app()->instance('tenant.university', $university);
        if ($college) {
            app()->instance('tenant.college', $college);
        }

        return $next($request);
    }

    protected function resolveCollegeById(string $id): ?College
    {
        return Cache::remember("college:id:{$id}", 3600, fn () => College::with('university')->find($id));
    }

    protected function resolveUniversityByDomain(string $host): ?University
    {
        return Cache::remember("university:domain:{$host}", 3600, function () use ($host) {
            return University::where('domain', $host)
                ->orWhere('slug', $this->extractSubdomain($host))
                ->first();
        });
    }

    protected function resolveUniversityBySlug(string $slug): ?University
    {
        return Cache::remember("university:slug:{$slug}", 3600, function () use ($slug) {
            return University::where('slug', $slug)->first();
        });
    }

    protected function resolveCollegeBySubdomain(string $host, ?University $university): ?College
    {
        if (!$university) {
            return null;
        }

        $subdomain = $this->extractCollegeSubdomain($host);
        if (!$subdomain) {
            return null;
        }

        return Cache::remember("college:{$university->id}:{$subdomain}", 3600, function () use ($university, $subdomain) {
            return College::where('university_id', $university->id)
                ->where('slug', $subdomain)
                ->first();
        });
    }

    protected function resolveCollegeBySlug(string $universityId, string $slug): ?College
    {
        return Cache::remember("college:{$universityId}:{$slug}", 3600, function () use ($universityId, $slug) {
            return College::where('university_id', $universityId)
                ->where('slug', $slug)
                ->first();
        });
    }

    protected function extractSubdomain(string $host): string
    {
        $parts = explode('.', $host);
        return count($parts) > 2 ? $parts[0] : '';
    }

    protected function extractCollegeSubdomain(string $host): ?string
    {
        $parts = explode('.', $host);
        // Format: college.university.domain.com
        return count($parts) > 3 ? $parts[0] : null;
    }
}
