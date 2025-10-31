'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  Plus, 
  X,
  ArrowUpDown 
} from 'lucide-react'

export interface SortField {
  field: string
  direction: 'asc' | 'desc'
}

export interface SortOption {
  value: string
  label: string
}

interface AdvancedSortingProps {
  sortOptions: SortOption[]
  currentSort: SortField[]
  onSortChange: (sort: SortField[]) => void
  maxColumns?: number
  className?: string
}

export function AdvancedSorting({
  sortOptions,
  currentSort,
  onSortChange,
  maxColumns = 3,
  className = ''
}: AdvancedSortingProps) {
  const [localSort, setLocalSort] = useState<SortField[]>(currentSort)

  const addSortColumn = () => {
    if (localSort.length >= maxColumns) return

    // Find first unused option
    const usedFields = localSort.map(s => s.field)
    const availableOption = sortOptions.find(opt => !usedFields.includes(opt.value))
    
    if (availableOption) {
      const newSort = [...localSort, { field: availableOption.value, direction: 'asc' as const }]
      setLocalSort(newSort)
      onSortChange(newSort)
    }
  }

  const removeSortColumn = (index: number) => {
    const newSort = localSort.filter((_, i) => i !== index)
    setLocalSort(newSort)
    onSortChange(newSort)
  }

  const updateSortField = (index: number, field: string) => {
    const newSort = [...localSort]
    newSort[index] = { ...newSort[index], field }
    setLocalSort(newSort)
    onSortChange(newSort)
  }

  const toggleDirection = (index: number) => {
    const newSort = [...localSort]
    newSort[index] = {
      ...newSort[index],
      direction: newSort[index].direction === 'asc' ? 'desc' : 'asc'
    }
    setLocalSort(newSort)
    onSortChange(newSort)
  }

  const moveSortColumn = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= localSort.length) return
    
    const newSort = [...localSort]
    const [removed] = newSort.splice(fromIndex, 1)
    newSort.splice(toIndex, 0, removed)
    setLocalSort(newSort)
    onSortChange(newSort)
  }

  const clearAll = () => {
    setLocalSort([])
    onSortChange([])
  }

  // Get available options for a specific index
  const getAvailableOptions = (currentIndex: number) => {
    const usedFields = localSort
      .map((s, i) => i !== currentIndex ? s.field : null)
      .filter(Boolean)
    
    return sortOptions.filter(opt => !usedFields.includes(opt.value))
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Advanced Sorting</span>
          {localSort.length > 0 && (
            <Badge className="bg-blue-100 text-blue-800">
              {localSort.length} column{localSort.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {localSort.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Sort Columns */}
      {localSort.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-4 border rounded-lg border-dashed">
          No sorting applied. Add a column to sort by.
        </div>
      ) : (
        <div className="space-y-2">
          {localSort.map((sort, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-white border rounded-lg"
            >
              {/* Drag Handle */}
              <button
                className="cursor-move p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  // Simple drag-to-reorder - could be enhanced with react-beautiful-dnd
                  e.preventDefault()
                }}
                title="Drag to reorder"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </button>

              {/* Priority Badge */}
              <Badge className="shrink-0 bg-gray-100 text-gray-700 font-mono">
                {index + 1}
              </Badge>

              {/* Field Selector */}
              <div className="flex-1">
                <Select
                  value={sort.field}
                  onChange={(value) => updateSortField(index, value)}
                  options={getAvailableOptions(index).map(opt => ({
                    value: opt.value,
                    label: opt.label
                  }))}
                  className="w-full"
                />
              </div>

              {/* Direction Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleDirection(index)}
                className="shrink-0 h-8 px-3 gap-1"
                title={sort.direction === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sort.direction === 'asc' ? (
                  <>
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-xs">ASC</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-xs">DESC</span>
                  </>
                )}
              </Button>

              {/* Move Up/Down */}
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveSortColumn(index, index - 1)}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                  title="Move up"
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveSortColumn(index, index + 1)}
                  disabled={index === localSort.length - 1}
                  className="h-8 w-8 p-0"
                  title="Move down"
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
              </div>

              {/* Remove */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSortColumn(index)}
                className="h-8 w-8 p-0 shrink-0"
                title="Remove"
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add Column Button */}
      {localSort.length < maxColumns && localSort.length < sortOptions.length && (
        <Button
          variant="outline"
          size="sm"
          onClick={addSortColumn}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Sort Column
        </Button>
      )}

      {/* Help Text */}
      {localSort.length > 1 && (
        <p className="text-xs text-gray-500">
          Records are sorted by priority: {localSort.map((s, i) => (
            <span key={i}>
              {i > 0 && ' → '}
              <span className="font-medium">{sortOptions.find(opt => opt.value === s.field)?.label}</span>
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
