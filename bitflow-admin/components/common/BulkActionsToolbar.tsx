'use client'

import { useState, useRef } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  Loader2,
  FileSpreadsheet,
  FileText,
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/toast'
import { API_URL, AUTH_TOKEN_KEY } from '@/lib/constants'

interface BulkActionsToolbarProps {
  selectedIds: string[]
  resourceType: 'universities' | 'colleges' | 'users'
  onActionComplete: () => void
}

export function BulkActionsToolbar({
  selectedIds,
  resourceType,
  onActionComplete,
}: BulkActionsToolbarProps) {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  
  const selectedCount = selectedIds.length

  // Export handlers
  const handleExport = async (format: 'csv' | 'excel') => {
    setIsExporting(true)
    try {
      const endpoint = selectedCount > 0
        ? `/${resourceType}/export/data?format=${format}&ids=${selectedIds.join(',')}`
        : `/${resourceType}/export/data?format=${format}`

      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      const response = await axios.get(`${API_URL}${endpoint}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      // Create download link
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resourceType}_export_${new Date().getTime()}.${format === 'csv' ? 'csv' : 'xlsx'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`Exported ${selectedCount > 0 ? selectedCount : 'all'} ${resourceType} to ${format.toUpperCase()}`)
    } catch (error: any) {
      toast.error(error.message || `Failed to export ${resourceType}`)
    } finally {
      setIsExporting(false)
    }
  }

  // Import handler
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      const response = await axios.post(`${API_URL}/${resourceType}/import/data`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      const data = response.data?.data || response.data
      const summary = data?.summary || data
      toast.success(
        `Import complete: ${summary.successful || 0} created, ${summary.failed || 0} failed`
      )
      
      onActionComplete()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Import failed'
      const errors = error.response?.data?.errors
      
      if (errors && Array.isArray(errors)) {
        toast.error(`Import failed with ${errors.length} errors`)
        console.error('Import errors:', errors)
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Bulk status update handler
  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedCount === 0) return

    setIsUpdating(true)
    try {
      const response: any = await apiClient.patch(`/${resourceType}/bulk/status`, {
        ids: selectedIds,
        status: selectedStatus,
      })

      const data = response?.data || response
      const results = data?.results || []
      const successful = results.filter((r: any) => r.success).length
      const failed = results.filter((r: any) => !r.success).length

      toast.success(`Updated ${successful} ${resourceType} to ${selectedStatus}`)
      if (failed > 0) {
        toast.error(`Failed to update ${failed} ${resourceType}`)
      }

      onActionComplete()
      setShowStatusDialog(false)
      setSelectedStatus('')
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${resourceType}`)
    } finally {
      setIsUpdating(false)
    }
  }

  // Bulk delete handler
  const handleDelete = async () => {
    if (selectedCount === 0) return

    setIsDeleting(true)
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      const response = await axios.delete(`${API_URL}/${resourceType}/bulk/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: {
          ids: selectedIds,
          permanent: false, // Soft delete by default
        },
      })

      const data = response.data?.data || response.data
      const results = data?.results || []
      const successful = results.filter((r: any) => r.success).length
      const failed = results.filter((r: any) => !r.success).length

      toast.success(`Deleted ${successful} ${resourceType}`)
      if (failed > 0) {
        toast.error(`Failed to delete ${failed} ${resourceType}`)
      }

      onActionComplete()
      setShowDeleteDialog(false)
    } catch (error: any) {
      toast.error(error.message || `Failed to delete ${resourceType}`)
    } finally {
      setIsDeleting(false)
    }
  }

  if (selectedCount === 0) {
    return null // Don't show toolbar if nothing selected
  }

  return (
    <>
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Bulk Actions ({selectedCount} selected):
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Export Dropdown */}
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                disabled={isExporting}
                className="gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export
              </Button>
              
              <div className="absolute left-0 mt-1 w-40 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                >
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 rounded-b-lg"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as Excel
                </button>
              </div>
            </div>

            {/* Import Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="gap-2"
            >
              {isImporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleImport}
              className="hidden"
            />

            {/* Update Status Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatusDialog(true)}
              disabled={isUpdating}
              className="gap-2"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Update Status
            </Button>

            {/* Delete Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Status Update Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Status</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new status for the {selectedCount} selected {resourceType}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status...</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} {resourceType}? This action can be undone by restoring from trash.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This will soft delete the selected items. They can be restored later if needed.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
