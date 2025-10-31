'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SelectionCounterProps {
  count: number
  totalCount: number
  onClear: () => void
  resourceType: string // e.g., "universities", "colleges", "users"
}

export function SelectionCounter({
  count,
  totalCount,
  onClear,
  resourceType,
}: SelectionCounterProps) {
  if (count === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
          {count}
        </div>
        <span className="text-blue-900 font-medium">
          {count} {resourceType} selected
        </span>
        {count === totalCount && (
          <span className="text-blue-700 text-sm">(All on this page)</span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
      >
        <X className="h-4 w-4 mr-1" />
        Clear Selection
      </Button>
    </div>
  )
}
