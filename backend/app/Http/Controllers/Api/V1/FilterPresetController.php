<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\FilterPreset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FilterPresetController extends Controller
{
    /**
     * Get all filter presets for the authenticated user.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'entity_type' => 'sometimes|string|in:university,college,user,department,faculty,student',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $query = FilterPreset::where('user_id', auth()->id())
            ->orderBy('order')
            ->orderBy('name');

        if ($request->has('entity_type')) {
            $query->forEntity($request->entity_type);
        }

        $presets = $query->get();

        return response()->json([
            'success' => true,
            'data' => $presets
        ]);
    }

    /**
     * Create a new filter preset.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'entity_type' => 'required|string|in:university,college,user,department,faculty,student',
            'filters' => 'required|array',
            'sort' => 'nullable|array',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for duplicate preset name for this user and entity type
        $exists = FilterPreset::where('user_id', auth()->id())
            ->where('entity_type', $request->entity_type)
            ->where('name', $request->name)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'A preset with this name already exists for this entity type.'
            ], 422);
        }

        $preset = FilterPreset::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'entity_type' => $request->entity_type,
            'filters' => $request->filters,
            'sort' => $request->sort,
            'is_default' => $request->is_default ?? false,
            'order' => FilterPreset::where('user_id', auth()->id())
                ->where('entity_type', $request->entity_type)
                ->max('order') + 1,
        ]);

        // If setting as default, unset other defaults
        if ($preset->is_default) {
            $preset->setAsDefault();
        }

        return response()->json([
            'success' => true,
            'message' => 'Filter preset created successfully.',
            'data' => $preset
        ], 201);
    }

    /**
     * Update an existing filter preset.
     */
    public function update(Request $request, string $id)
    {
        $preset = FilterPreset::where('user_id', auth()->id())
            ->find($id);

        if (!$preset) {
            return response()->json([
                'success' => false,
                'message' => 'Filter preset not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'filters' => 'sometimes|array',
            'sort' => 'nullable|array',
            'is_default' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for duplicate name if name is being updated
        if ($request->has('name') && $request->name !== $preset->name) {
            $exists = FilterPreset::where('user_id', auth()->id())
                ->where('entity_type', $preset->entity_type)
                ->where('name', $request->name)
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'A preset with this name already exists for this entity type.'
                ], 422);
            }
        }

        $preset->update($request->only(['name', 'filters', 'sort', 'is_default', 'order']));

        // If setting as default, unset other defaults
        if ($request->has('is_default') && $request->is_default) {
            $preset->setAsDefault();
        }

        return response()->json([
            'success' => true,
            'message' => 'Filter preset updated successfully.',
            'data' => $preset
        ]);
    }

    /**
     * Delete a filter preset.
     */
    public function destroy(string $id)
    {
        $preset = FilterPreset::where('user_id', auth()->id())
            ->find($id);

        if (!$preset) {
            return response()->json([
                'success' => false,
                'message' => 'Filter preset not found.'
            ], 404);
        }

        $preset->delete();

        return response()->json([
            'success' => true,
            'message' => 'Filter preset deleted successfully.'
        ]);
    }

    /**
     * Set a preset as default.
     */
    public function setDefault(string $id)
    {
        $preset = FilterPreset::where('user_id', auth()->id())
            ->find($id);

        if (!$preset) {
            return response()->json([
                'success' => false,
                'message' => 'Filter preset not found.'
            ], 404);
        }

        $preset->setAsDefault();

        return response()->json([
            'success' => true,
            'message' => 'Preset set as default successfully.',
            'data' => $preset
        ]);
    }

    /**
     * Reorder presets.
     */
    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'entity_type' => 'required|string|in:university,college,user,department,faculty,student',
            'preset_ids' => 'required|array',
            'preset_ids.*' => 'required|string|exists:filter_presets,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Update order for each preset
        foreach ($request->preset_ids as $index => $presetId) {
            FilterPreset::where('user_id', auth()->id())
                ->where('id', $presetId)
                ->update(['order' => $index]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Presets reordered successfully.'
        ]);
    }
}
