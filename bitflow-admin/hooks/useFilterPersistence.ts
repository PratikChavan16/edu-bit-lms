'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FilterValue } from '@/components/common/AdvancedFilterPanel'
import type { SortField } from '@/components/common/AdvancedSorting'

interface UseFilterPersistenceOptions {
  storageKey: string
  enableLocalStorage?: boolean
  enableURLParams?: boolean
}

interface PersistedState {
  filters: FilterValue
  sort: SortField[]
}

export function useFilterPersistence({
  storageKey,
  enableLocalStorage = true,
  enableURLParams = true,
}: UseFilterPersistenceOptions) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterValue>({})
  const [sort, setSort] = useState<SortField[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load initial state from localStorage and URL params
  useEffect(() => {
    if (isInitialized) return

    let loadedState: PersistedState = { filters: {}, sort: [] }

    // Priority 1: URL parameters (shareable links)
    if (enableURLParams && searchParams) {
      const urlFilters = searchParams.get('filters')
      const urlSort = searchParams.get('sort')

      if (urlFilters) {
        try {
          loadedState.filters = JSON.parse(decodeURIComponent(urlFilters))
        } catch (e) {
          console.error('Failed to parse URL filters:', e)
        }
      }

      if (urlSort) {
        try {
          loadedState.sort = JSON.parse(decodeURIComponent(urlSort))
        } catch (e) {
          console.error('Failed to parse URL sort:', e)
        }
      }
    }

    // Priority 2: localStorage (if no URL params)
    if (enableLocalStorage && !searchParams?.get('filters') && !searchParams?.get('sort')) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored) as PersistedState
          loadedState = parsed
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e)
      }
    }

    setFilters(loadedState.filters)
    setSort(loadedState.sort)
    setIsInitialized(true)
  }, [storageKey, enableLocalStorage, enableURLParams, searchParams, isInitialized])

  // Save to localStorage
  const saveToLocalStorage = useCallback((state: PersistedState) => {
    if (!enableLocalStorage) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [storageKey, enableLocalStorage])

  // Update URL parameters
  const updateURLParams = useCallback((state: PersistedState) => {
    if (!enableURLParams) return

    const params = new URLSearchParams(window.location.search)

    // Only add params if there are filters or sorting
    if (Object.keys(state.filters).length > 0) {
      params.set('filters', encodeURIComponent(JSON.stringify(state.filters)))
    } else {
      params.delete('filters')
    }

    if (state.sort.length > 0) {
      params.set('sort', encodeURIComponent(JSON.stringify(state.sort)))
    } else {
      params.delete('sort')
    }

    // Update URL without reloading the page
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.replace(newUrl, { scroll: false })
  }, [enableURLParams, router])

  // Persist filters
  const persistFilters = useCallback((newFilters: FilterValue) => {
    setFilters(newFilters)
    const state: PersistedState = { filters: newFilters, sort }
    saveToLocalStorage(state)
    updateURLParams(state)
  }, [sort, saveToLocalStorage, updateURLParams])

  // Persist sort
  const persistSort = useCallback((newSort: SortField[]) => {
    setSort(newSort)
    const state: PersistedState = { filters, sort: newSort }
    saveToLocalStorage(state)
    updateURLParams(state)
  }, [filters, saveToLocalStorage, updateURLParams])

  // Clear all persisted state
  const clearPersisted = useCallback(() => {
    setFilters({})
    setSort([])
    
    if (enableLocalStorage) {
      try {
        localStorage.removeItem(storageKey)
      } catch (e) {
        console.error('Failed to clear localStorage:', e)
      }
    }

    if (enableURLParams) {
      router.replace(window.location.pathname, { scroll: false })
    }
  }, [storageKey, enableLocalStorage, enableURLParams, router])

  return {
    filters,
    sort,
    persistFilters,
    persistSort,
    clearPersisted,
    isInitialized,
  }
}
