<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

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
        // TODO: load from feature_catalog table
        $toggles = [
            [
                'code' => 'LIBRARY_VIDEO_STREAMING',
                'name' => 'Library video streaming',
                'description' => 'Enable MediaConvert pipeline for hosted lectures.',
                'category' => 'library',
                'state' => 'on',
                'defaultState' => 'on',
                'scope' => 'global',
                'rolloutType' => 'toggle',
                'dependencies' => [],
                'locked' => false,
                'audit' => [],
            ],
            [
                'code' => 'PAYROLL_MODULE',
                'name' => 'Payroll module',
                'description' => 'Expose payroll and reconciliation features.',
                'category' => 'finance',
                'state' => 'off',
                'defaultState' => 'off',
                'scope' => 'university',
                'rolloutType' => 'toggle',
                'dependencies' => ['HRMS_MODULE'],
                'locked' => false,
                'audit' => [],
            ],
        ];

        return response()->json($toggles);
    }

    /**
     * POST /admin/feature-toggles
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // TODO: validate and persist
        $validated = $request->validate([
            'code' => 'required|string|regex:/^[A-Z0-9_]+$/',
            'name' => 'required|string',
            'description' => 'required|string',
            'defaultState' => 'required|in:on,off,preview',
            'scope' => 'required|in:global,university,college',
            'rolloutType' => 'nullable|in:gradual,toggle,beta',
            'dependencies' => 'nullable|array',
        ]);

        $toggle = array_merge($validated, [
            'state' => $validated['defaultState'],
            'category' => 'other',
            'locked' => false,
            'audit' => [],
        ]);

        return response()->json($toggle, 201);
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
        // TODO: load, validate, update
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'state' => 'sometimes|in:on,off,preview',
            'rolloutType' => 'sometimes|in:gradual,toggle,beta',
            'dependencies' => 'sometimes|array',
            'locked' => 'sometimes|boolean',
        ]);

        $toggle = [
            'code' => $code,
            'name' => $validated['name'] ?? 'Feature toggle',
            'description' => $validated['description'] ?? '',
            'state' => $validated['state'] ?? 'off',
            'defaultState' => 'off',
            'scope' => 'global',
            'rolloutType' => $validated['rolloutType'] ?? 'toggle',
            'dependencies' => $validated['dependencies'] ?? [],
            'locked' => $validated['locked'] ?? false,
            'audit' => [],
        ];

        return response()->json($toggle);
    }
}
