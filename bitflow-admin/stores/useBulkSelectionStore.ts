import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Bulk Selection Store
 * 
 * Manages bulk selection state for data tables across the portal.
 * Supports multiple resource types (universities, colleges, users, etc.)
 * with independent selection states.
 */

interface BulkSelectionState {
  // Selection state per resource type
  selectedUniversities: Set<string>;
  selectedColleges: Set<string>;
  selectedUsers: Set<string>;
  
  // Selection actions for universities
  selectUniversity: (id: string) => void;
  deselectUniversity: (id: string) => void;
  selectAllUniversities: (ids: string[]) => void;
  clearUniversitySelection: () => void;
  toggleUniversity: (id: string) => void;
  
  // Selection actions for colleges
  selectCollege: (id: string) => void;
  deselectCollege: (id: string) => void;
  selectAllColleges: (ids: string[]) => void;
  clearCollegeSelection: () => void;
  toggleCollege: (id: string) => void;
  
  // Selection actions for users
  selectUser: (id: string) => void;
  deselectUser: (id: string) => void;
  selectAllUsers: (ids: string[]) => void;
  clearUserSelection: () => void;
  toggleUser: (id: string) => void;
  
  // Utility actions
  clearAllSelections: () => void;
}

export const useBulkSelectionStore = create<BulkSelectionState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedUniversities: new Set<string>(),
      selectedColleges: new Set<string>(),
      selectedUsers: new Set<string>(),
      
      // University selection actions
      selectUniversity: (id) =>
        set((state) => ({
          selectedUniversities: new Set(state.selectedUniversities).add(id),
        })),
      
      deselectUniversity: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedUniversities);
          newSet.delete(id);
          return { selectedUniversities: newSet };
        }),
      
      selectAllUniversities: (ids) =>
        set(() => ({
          selectedUniversities: new Set(ids),
        })),
      
      clearUniversitySelection: () =>
        set(() => ({
          selectedUniversities: new Set<string>(),
        })),
      
      toggleUniversity: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedUniversities);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { selectedUniversities: newSet };
        }),
      
      // College selection actions
      selectCollege: (id) =>
        set((state) => ({
          selectedColleges: new Set(state.selectedColleges).add(id),
        })),
      
      deselectCollege: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedColleges);
          newSet.delete(id);
          return { selectedColleges: newSet };
        }),
      
      selectAllColleges: (ids) =>
        set(() => ({
          selectedColleges: new Set(ids),
        })),
      
      clearCollegeSelection: () =>
        set(() => ({
          selectedColleges: new Set<string>(),
        })),
      
      toggleCollege: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedColleges);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { selectedColleges: newSet };
        }),
      
      // User selection actions
      selectUser: (id) =>
        set((state) => ({
          selectedUsers: new Set(state.selectedUsers).add(id),
        })),
      
      deselectUser: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedUsers);
          newSet.delete(id);
          return { selectedUsers: newSet };
        }),
      
      selectAllUsers: (ids) =>
        set(() => ({
          selectedUsers: new Set(ids),
        })),
      
      clearUserSelection: () =>
        set(() => ({
          selectedUsers: new Set<string>(),
        })),
      
      toggleUser: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedUsers);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { selectedUsers: newSet };
        }),
      
      // Clear all selections
      clearAllSelections: () =>
        set(() => ({
          selectedUniversities: new Set<string>(),
          selectedColleges: new Set<string>(),
          selectedUsers: new Set<string>(),
        })),
    }),
    {
      name: 'bulk-selection-storage',
      // Custom serialization for Sets
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            state: {
              ...parsed.state,
              selectedUniversities: new Set(parsed.state.selectedUniversities || []),
              selectedColleges: new Set(parsed.state.selectedColleges || []),
              selectedUsers: new Set(parsed.state.selectedUsers || []),
            },
          };
        },
        setItem: (name, value) => {
          const str = JSON.stringify({
            state: {
              ...value.state,
              selectedUniversities: Array.from(value.state.selectedUniversities),
              selectedColleges: Array.from(value.state.selectedColleges),
              selectedUsers: Array.from(value.state.selectedUsers),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

// Helper hook to get selection count
export const useUniversitySelectionCount = () => {
  const selectedUniversities = useBulkSelectionStore((state) => state.selectedUniversities);
  return selectedUniversities.size;
};

export const useCollegeSelectionCount = () => {
  const selectedColleges = useBulkSelectionStore((state) => state.selectedColleges);
  return selectedColleges.size;
};

export const useUserSelectionCount = () => {
  const selectedUsers = useBulkSelectionStore((state) => state.selectedUsers);
  return selectedUsers.size;
};
