'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, RotateCcw, Building2 } from 'lucide-react'
import { useBulkSelectionStore } from '@/stores/useBulkSelectionStore'
import type { College, University } from '@/types'

interface CollegesTableProps {
  colleges: College[]
  universities: University[]
  isLoading: boolean
  onEdit: (college: College) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}

export function CollegesTable({
  colleges,
  universities,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
}: CollegesTableProps) {
  // Bulk selection state
  const selectedColleges = useBulkSelectionStore((state) => state.selectedColleges)
  const toggleCollege = useBulkSelectionStore((state) => state.toggleCollege)
  const selectAllColleges = useBulkSelectionStore((state) => state.selectAllColleges)
  const clearCollegeSelection = useBulkSelectionStore((state) => state.clearCollegeSelection)
  
  // Get IDs of colleges on current page
  const currentPageIds = colleges.map((c) => c.id)
  
  // Check if all on current page are selected
  const allOnPageSelected = currentPageIds.length > 0 && 
    currentPageIds.every((id) => selectedColleges.has(id))
  
  // Check if some (but not all) on current page are selected
  const someOnPageSelected = currentPageIds.some((id) => selectedColleges.has(id)) && 
    !allOnPageSelected
  
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (allOnPageSelected) {
      // Deselect all on current page
      const newSelection = new Set(selectedColleges)
      currentPageIds.forEach((id) => newSelection.delete(id))
      selectAllColleges(Array.from(newSelection))
    } else {
      // Select all on current page (preserving selections from other pages)
      const newSelection = new Set([...Array.from(selectedColleges), ...currentPageIds])
      selectAllColleges(Array.from(newSelection))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="mt-2 text-gray-500">Loading colleges...</p>
      </div>
    )
  }

  if (colleges.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
        <p className="text-gray-500">No colleges found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left w-12">
              <Checkbox
                checked={allOnPageSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all colleges on this page"
                className={someOnPageSelected ? 'data-[state=checked]:bg-blue-400' : ''}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              College
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              University
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Students
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {colleges.map((college) => {
            const isSelected = selectedColleges.has(college.id)
            
            return (
              <tr 
                key={college.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleCollege(college.id)}
                    aria-label={`Select ${college.name}`}
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{college.name}</div>
                    <div className="text-sm text-gray-500">Code: {college.code}</div>
                    {college.established_year && (
                      <div className="text-xs text-gray-400">Est. {college.established_year}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {college.university?.name || universities.find(u => u.id === college.university_id)?.name || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(college.status)}`}>
                    {college.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {college.current_enrollment?.toLocaleString() || 0}
                  </div>
                  {college.stats && (
                    <div className="text-xs text-gray-500">
                      {college.stats.enrollment_percentage.toFixed(1)}% filled
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {college.capacity?.toLocaleString() || 'N/A'}
                  </div>
                  {college.capacity && college.current_enrollment && (
                    <div className="text-xs text-gray-500">
                      {college.capacity - college.current_enrollment} available
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{college.email}</div>
                  {college.phone && (
                    <div className="text-xs text-gray-500">{college.phone}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {college.status !== 'suspended' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(college)}
                          title="Edit College"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(college.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete College"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRestore(college.id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Restore College"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
