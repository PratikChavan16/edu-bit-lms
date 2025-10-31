'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Star, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  GripVertical,
  StarOff
} from 'lucide-react'
import type { FilterValue } from './AdvancedFilterPanel'

interface FilterPreset {
  id: string
  name: string
  entity_type: string
  filters: FilterValue
  sort?: { field: string; direction: 'asc' | 'desc' }[]
  is_default: boolean
  order: number
  created_at: string
  updated_at: string
}

interface FilterPresetManagerProps {
  entityType: 'university' | 'college' | 'user' | 'department' | 'faculty' | 'student'
  currentFilters: FilterValue
  currentSort?: { field: string; direction: 'asc' | 'desc' }[]
  onApplyPreset: (preset: FilterPreset) => void
  className?: string
}

export function FilterPresetManager({
  entityType,
  currentFilters,
  currentSort,
  onApplyPreset,
  className = ''
}: FilterPresetManagerProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')

  // Load presets on mount and when entity type changes
  useEffect(() => {
    loadPresets()
  }, [entityType])

  const loadPresets = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response: any = await apiClient.get(`/filter-presets?entity_type=${entityType}`)
      if (response.data.success) {
        setPresets(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load presets')
    } finally {
      setIsLoading(false)
    }
  }

  const savePreset = async () => {
    if (!newPresetName.trim()) {
      setError('Please enter a preset name')
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const response: any = await apiClient.post('/filter-presets', {
        name: newPresetName.trim(),
        entity_type: entityType,
        filters: currentFilters,
        sort: currentSort,
        is_default: false
      })

      if (response.data.success) {
        setPresets([...presets, response.data.data])
        setNewPresetName('')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save preset')
    } finally {
      setIsSaving(false)
    }
  }

  const updatePreset = async (id: string, updates: Partial<FilterPreset>) => {
    setError('')
    try {
      const response: any = await apiClient.put(`/filter-presets/${id}`, updates)
      if (response.data.success) {
        setPresets(presets.map(p => p.id === id ? response.data.data : p))
        setEditingId(null)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update preset')
    }
  }

  const deletePreset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this preset?')) return

    setError('')
    try {
      await apiClient.delete(`/filter-presets/${id}`)
      setPresets(presets.filter(p => p.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete preset')
    }
  }

  const setDefault = async (id: string) => {
    setError('')
    try {
      const response: any = await apiClient.post(`/filter-presets/${id}/set-default`)
      if (response.data.success) {
        // Update local state
        setPresets(presets.map(p => ({
          ...p,
          is_default: p.id === id
        })))
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set default')
    }
  }

  const hasActiveFilters = Object.keys(currentFilters).length > 0

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Save Current Filters */}
      {hasActiveFilters && (
        <div className="flex gap-2">
          <Input
            placeholder="Preset name (e.g., Active Universities)"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && savePreset()}
            className="flex-1"
          />
          <Button
            onClick={savePreset}
            disabled={isSaving || !newPresetName.trim()}
            size="sm"
            className="shrink-0"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Preset
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* Presets List */}
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading presets...</div>
      ) : presets.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4">
          No saved presets. Apply filters and save them for quick access.
        </div>
      ) : (
        <div className="space-y-2">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-gray-300 transition-colors"
            >
              {/* Drag Handle */}
              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />

              {/* Preset Name */}
              {editingId === preset.id ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      updatePreset(preset.id, { name: editName })
                    } else if (e.key === 'Escape') {
                      setEditingId(null)
                    }
                  }}
                  className="flex-1 h-8"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => onApplyPreset(preset)}
                  className="flex-1 text-left text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {preset.name}
                </button>
              )}

              {/* Default Badge */}
              {preset.is_default && (
                <Badge className="shrink-0 bg-yellow-100 text-yellow-800">
                  Default
                </Badge>
              )}

              {/* Filter Count */}
              <Badge className="shrink-0">
                {Object.keys(preset.filters).length} filters
              </Badge>

              {/* Actions */}
              <div className="flex gap-1 shrink-0">
                {editingId === preset.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updatePreset(preset.id, { name: editName })}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(preset.id)
                        setEditName(preset.name)
                      }}
                      className="h-8 w-8 p-0"
                      title="Rename"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDefault(preset.id)}
                      className="h-8 w-8 p-0"
                      title={preset.is_default ? 'Remove default' : 'Set as default'}
                    >
                      {preset.is_default ? (
                        <StarOff className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePreset(preset.id)}
                      className="h-8 w-8 p-0"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
