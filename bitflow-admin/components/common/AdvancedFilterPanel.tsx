'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Filter, X, ChevronDown, Bookmark } from 'lucide-react'
import { FilterPresetManager } from './FilterPresetManager'
import { AdvancedSorting, type SortField, type SortOption } from './AdvancedSorting'

export interface FilterField {
  id: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'number' | 'numberrange'
  placeholder?: string
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  sortable?: boolean // Whether this field can be used for sorting
}

export interface FilterValue {
  [key: string]: string | number | string[] | { min?: string; max?: string } | null | undefined
}

// Re-export SortField for convenience
export type { SortField, SortOption }

interface AdvancedFilterPanelProps {
  fields: FilterField[]
  filters: FilterValue
  onFiltersChange: (filters: FilterValue) => void
  onApply: () => void
  onReset: () => void
  isOpen: boolean
  onToggle: () => void
  entityType?: 'university' | 'college' | 'user' | 'department' | 'faculty' | 'student'
  enablePresets?: boolean
  enableSorting?: boolean
  currentSort?: SortField[]
  onSortChange?: (sort: SortField[]) => void
}

export function AdvancedFilterPanel({
  fields,
  filters,
  onFiltersChange,
  onApply,
  onReset,
  isOpen,
  onToggle,
  entityType = 'university',
  enablePresets = true,
  enableSorting = true,
  currentSort = [],
  onSortChange = () => {},
}: AdvancedFilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterValue>(filters)
  const [showPresets, setShowPresets] = useState(false)

  // Generate sort options from sortable fields
  const sortOptions: SortOption[] = fields
    .filter(field => field.sortable !== false)
    .map(field => ({
      value: field.id,
      label: field.label
    }))

  const handleFilterChange = (fieldId: string, value: string | number | string[] | { min?: string; max?: string }) => {
    setLocalFilters((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onApply()
  }

  const handleReset = () => {
    setLocalFilters({})
    onFiltersChange({})
    onReset()
  }

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
  ).length

  const renderFilterField = (field: FilterField) => {
    const value = localFilters[field.id]

    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e) => handleFilterChange(field.id, e.target.value)}
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={(value as string) || ''}
            min={field.min}
            max={field.max}
            onChange={(e) => handleFilterChange(field.id, e.target.value)}
          />
        )

      case 'select':
        return (
          <Select
            value={(value as string) || ''}
            onChange={(val) => handleFilterChange(field.id, val)}
            options={field.options || []}
            placeholder={field.placeholder || 'Select...'}
          />
        )

      case 'multiselect':
        const selectedValues = (value as string[]) || []
        return (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => {
                const dropdown = document.getElementById(`multiselect-${field.id}`)
                dropdown?.classList.toggle('hidden')
              }}
            >
              {selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : field.placeholder || 'Select...'}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
            <div
              id={`multiselect-${field.id}`}
              className="hidden absolute z-50 w-full mt-1 max-h-64 overflow-y-auto rounded-md border bg-white shadow-lg"
            >
              {field.options?.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    const newValues = selectedValues.includes(option.value)
                      ? selectedValues.filter((v) => v !== option.value)
                      : [...selectedValues, option.value]
                    handleFilterChange(field.id, newValues)
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label className="flex-1 cursor-pointer text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case 'numberrange':
        const numRange = (value as { min?: string; max?: string }) || { min: '', max: '' }
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">Min</Label>
              <Input
                type="number"
                placeholder="Min"
                value={numRange.min || ''}
                min={field.min}
                onChange={(e) =>
                  handleFilterChange(field.id, { ...numRange, min: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Max</Label>
              <Input
                type="number"
                placeholder="Max"
                value={numRange.max || ''}
                max={field.max}
                onChange={(e) =>
                  handleFilterChange(field.id, { ...numRange, max: e.target.value })
                }
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 bg-blue-600 text-white">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {enablePresets && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPresets(!showPresets)}
            className="gap-2"
          >
            <Bookmark className="h-4 w-4" />
            Presets
          </Button>
        )}

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          {/* Preset Manager */}
          {enablePresets && showPresets && (
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-sm font-semibold mb-3">Saved Presets</h3>
              <FilterPresetManager
                entityType={entityType}
                currentFilters={localFilters}
                currentSort={currentSort}
                onApplyPreset={(preset) => {
                  setLocalFilters(preset.filters)
                  onFiltersChange(preset.filters)
                  if (preset.sort && onSortChange) {
                    onSortChange(preset.sort)
                  }
                  onApply()
                  setShowPresets(false)
                }}
              />
            </div>
          )}

          {/* Advanced Sorting */}
          {enableSorting && (
            <div className="mb-4 pb-4 border-b">
              <AdvancedSorting
                sortOptions={sortOptions}
                currentSort={currentSort}
                onSortChange={onSortChange}
                maxColumns={3}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {renderFilterField(field)}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={handleReset} size="sm">
              Reset
            </Button>
            <Button onClick={handleApply} size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && !isOpen && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === '') return null

            const field = fields.find((f) => f.id === key)
            if (!field) return null

            let displayValue: string = String(value)
            if (field.type === 'multiselect' && Array.isArray(value)) {
              displayValue = `${value.length} selected`
            } else if (field.type === 'numberrange' && typeof value === 'object' && value !== null) {
              const range = value as { min?: string; max?: string }
              displayValue = `${range.min || '∞'} - ${range.max || '∞'}`
            } else if (field.type === 'select') {
              const option = field.options?.find((o) => o.value === value)
              displayValue = option?.label || String(value)
            }

            return (
              <Badge key={key} variant="default" className="gap-1 bg-blue-100 text-blue-800">
                <span className="font-medium">{field.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => {
                    const newFilters = { ...filters }
                    delete newFilters[key]
                    onFiltersChange(newFilters)
                  }}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
