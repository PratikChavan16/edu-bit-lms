'use client'

import { useEffect, useState } from 'react'
import { useGodModeStore } from '@/stores/god-mode-store'
import { useAuthStore } from '@/stores/auth-store'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Crown } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import type { University, ApiResponse } from '@/types'

export function GodModeSelector() {
  const { user } = useAuthStore()
  const {
    isGodMode,
    selectedUniversityId,
    universities,
    setGodMode,
    setSelectedUniversity,
    setUniversities,
  } = useGodModeStore()
  const [loading, setLoading] = useState(false)

  // Check if user has God Mode (bitflow_owner or bitflow_admin role)
  const hasGodMode = user?.roles?.some(
    (role) => role === 'bitflow_owner' || role === 'bitflow_admin'
  )

  // Load universities list
  useEffect(() => {
    if (hasGodMode) {
      setGodMode(true)
      loadUniversities()
    } else {
      setGodMode(false)
    }
  }, [hasGodMode])

  const loadUniversities = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<ApiResponse<University[]>>('/universities')
      const universitiesData = response.data || []
      setUniversities(universitiesData)
    } catch (error) {
      console.error('Failed to load universities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUniversityChange = (value: string) => {
    if (value === 'all') {
      setSelectedUniversity(null)
    } else {
      setSelectedUniversity(value)
    }
  }

  // Don't show if not God Mode user
  if (!hasGodMode || !isGodMode) {
    return null
  }

  const selectOptions = [
    { label: 'All Universities', value: 'all' },
    ...universities.map((uni) => ({
      label: uni.name,
      value: uni.id,
    })),
  ]

  return (
    <div className="flex items-center gap-3">
      <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">
        <Crown className="h-3 w-3 mr-1" />
        God Mode
      </Badge>
      <Select
        options={selectOptions}
        value={selectedUniversityId || 'all'}
        onChange={handleUniversityChange}
        className="w-64"
        disabled={loading}
      />
    </div>
  )
}
