import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { University } from '@/types'

interface GodModeState {
  isGodMode: boolean
  selectedUniversityId: string | null
  universities: University[]
  setGodMode: (isGodMode: boolean) => void
  setSelectedUniversity: (universityId: string | null) => void
  setUniversities: (universities: University[]) => void
  clearSelection: () => void
}

export const useGodModeStore = create<GodModeState>()(
  persist(
    (set) => ({
      isGodMode: false,
      selectedUniversityId: null,
      universities: [],

      setGodMode: (isGodMode: boolean) => {
        set({ isGodMode })
        if (!isGodMode) {
          set({ selectedUniversityId: null })
        }
      },

      setSelectedUniversity: (universityId: string | null) => {
        set({ selectedUniversityId: universityId })
      },

      setUniversities: (universities: University[]) => {
        set({ universities })
      },

      clearSelection: () => {
        set({ selectedUniversityId: null })
      },
    }),
    {
      name: 'bitflow-god-mode',
      partialize: (state) => ({
        selectedUniversityId: state.selectedUniversityId,
      }),
    }
  )
)
