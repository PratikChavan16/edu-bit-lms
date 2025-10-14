<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Models\FeatureCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Feature toggles controller.
 */
final class FeatureTogglesController
{
    /**
     * GET /admin/feature-toggles
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Load from feature_catalog table
        $features = FeatureCatalog::query()
            ->when($request->filled('category'), fn($q) => $q->where('category', $request->category))
            ->when($request->filled('scope'), fn($q) => $q->where('scope', $request->scope))
            ->get()
            ->map(function ($feature) {
                return [
                    'id' => $feature->id,
                    'code' => $feature->code,
                    'name' => $feature->name,
                    'description' => $feature->description,
                    'category' => $feature->category,
                    'state' => $feature->state,
                    'defaultState' => $feature->default_state,
                    'scope' => $feature->scope,
                    'rolloutType' => $feature->rollout_type,
                    'dependencies' => $feature->dependencies ?? [],
                    'locked' => (bool)$feature->locked,
                    'createdAt' => $feature->created_at?->toIso8601String(),
                    'updatedAt' => $feature->updated_at?->toIso8601String(),
                ];
            });

        return response()->json($features);
    }

    /**
     * POST /admin/feature-toggles
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validate and persist to database
        $validated = $request->validate([
            'code' => 'required|string|regex:/^[A-Z0-9_]+$/|unique:feature_catalog,code',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:50',
            'defaultState' => 'required|in:on,off,preview',
            'scope' => 'required|in:global,university,college',
            'rolloutType' => 'nullable|in:gradual,toggle,beta',
            'dependencies' => 'nullable|array',
            'dependencies.*' => 'string|exists:feature_catalog,code',
        ]);

        $feature = FeatureCatalog::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category' => $validated['category'] ?? 'other',
            'state' => $validated['defaultState'],
            'default_state' => $validated['defaultState'],
            'scope' => $validated['scope'],
            'rollout_type' => $validated['rolloutType'] ?? 'toggle',
            'dependencies' => $validated['dependencies'] ?? null,
            'locked' => false,
        ]);

        return response()->json([
            'id' => $feature->id,
            'code' => $feature->code,
            'name' => $feature->name,
            'description' => $feature->description,
            'category' => $feature->category,
            'state' => $feature->state,
            'defaultState' => $feature->default_state,
            'scope' => $feature->scope,
            'rolloutType' => $feature->rollout_type,
            'dependencies' => $feature->dependencies ?? [],
            'locked' => (bool)$feature->locked,
            'createdAt' => $feature->created_at?->toIso8601String(),
        ], 201);
    }

    /**
     * PATCH /admin/feature-toggles/{code}
     *
     * @param string $code
     * @param Request $request
     * @return JsonResponse
     */
    public function update(string $code, Request $request): JsonResponse
    {
        // Load feature from database
        $feature = FeatureCatalog::where('code', $code)->firstOrFail();
        
        // Check if locked
        if ($feature->locked && $request->has('state')) {
            return response()->json([
                'error' => 'Cannot modify locked feature toggle',
            ], 403);
        }
        
        // Validate and update
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string|max:50',
            'state' => 'sometimes|in:on,off,preview',
            'defaultState' => 'sometimes|in:on,off,preview',
            'rolloutType' => 'sometimes|in:gradual,toggle,beta',
            'dependencies' => 'sometimes|array|nullable',
            'dependencies.*' => 'string|exists:feature_catalog,code',
            'locked' => 'sometimes|boolean',
        ]);

        $updateData = [];
        if (isset($validated['name'])) $updateData['name'] = $validated['name'];
        if (isset($validated['description'])) $updateData['description'] = $validated['description'];
        if (isset($validated['category'])) $updateData['category'] = $validated['category'];
        if (isset($validated['state'])) $updateData['state'] = $validated['state'];
        if (isset($validated['defaultState'])) $updateData['default_state'] = $validated['defaultState'];
        if (isset($validated['rolloutType'])) $updateData['rollout_type'] = $validated['rolloutType'];
        if (array_key_exists('dependencies', $validated)) $updateData['dependencies'] = $validated['dependencies'];
        if (isset($validated['locked'])) $updateData['locked'] = $validated['locked'];

        $feature->update($updateData);

        return response()->json([
            'id' => $feature->id,
            'code' => $feature->code,
            'name' => $feature->name,
            'description' => $feature->description,
            'category' => $feature->category,
            'state' => $feature->state,
            'defaultState' => $feature->default_state,
            'scope' => $feature->scope,
            'rolloutType' => $feature->rollout_type,
            'dependencies' => $feature->dependencies ?? [],
            'locked' => (bool)$feature->locked,
            'updatedAt' => $feature->updated_at?->toIso8601String(),
        ]);
    }
}
