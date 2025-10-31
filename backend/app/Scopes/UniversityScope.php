<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class UniversityScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // BYPASS SCOPING FOR GOD MODE (Bitflow Owner)
        $user = auth()->user();
        
        // Skip scoping if user has bitflow_owner role (God Mode)
        if ($user && $this->hasGodMode($user)) {
            // Bitflow Owners see ALL data across ALL universities
            return;
        }

        // Get university_id from authenticated user's JWT token
        $universityId = $this->getUniversityIdFromContext();

        if ($universityId && $this->modelHasUniversityId($model)) {
            $builder->where($model->getTable() . '.university_id', $universityId);
        }
    }

    /**
     * Check if user has God Mode (bitflow_owner role)
     */
    private function hasGodMode($user): bool
    {
        if (!$user) {
            return false;
        }

        // Check if user has bitflow_owner role
        return $user->hasRole('bitflow_owner');
    }

    /**
     * Get university_id from request context
     */
    private function getUniversityIdFromContext(): ?string
    {
        // Try to get from request attribute (set by middleware)
        if (request()->has('university_id')) {
            return request()->get('university_id');
        }

        // Try to get from authenticated user
        $user = auth()->user();
        if ($user && isset($user->university_id)) {
            return $user->university_id;
        }

        return null;
    }

    /**
     * Check if model has university_id column
     */
    private function modelHasUniversityId(Model $model): bool
    {
        return in_array('university_id', $model->getFillable()) || 
               property_exists($model, 'universityScoped') && $model->universityScoped;
    }
}
