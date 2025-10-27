'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Pencil, Trash2, RefreshCw } from 'lucide-react'
import type { University } from '@/types'

interface UniversitiesTableProps {
  universities: University[]
  isLoading: boolean
  onEdit: (university: University) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}

export function UniversitiesTable({
  universities,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
}: UniversitiesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'inactive':
        return <Badge variant="warning">Inactive</Badge>
      case 'suspended':
        return <Badge variant="danger">Suspended</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatStorage = (usedMb: number, quotaGb: number) => {
    const usedGb = (usedMb / 1024).toFixed(2)
    const percentage = ((usedMb / 1024 / quotaGb) * 100).toFixed(1)
    return `${usedGb} GB / ${quotaGb} GB (${percentage}%)`
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="mt-2 text-gray-500">Loading universities...</p>
      </div>
    )
  }

  if (universities.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No universities found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Storage</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {universities.map((university) => (
          <TableRow key={university.id}>
            <TableCell className="font-medium">{university.name}</TableCell>
            <TableCell className="text-gray-500">{university.domain}</TableCell>
            <TableCell className="text-gray-500">{university.email}</TableCell>
            <TableCell>{getStatusBadge(university.status)}</TableCell>
            <TableCell className="text-sm text-gray-500">
              {formatStorage(university.storage_used_mb, university.storage_quota_gb)}
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {new Date(university.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="relative inline-block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenMenuId(openMenuId === university.id ? null : university.id)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                
                {openMenuId === university.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onEdit(university)
                            setOpenMenuId(null)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                        {university.deleted_at ? (
                          <button
                            onClick={() => {
                              onRestore(university.id)
                              setOpenMenuId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onDelete(university.id)
                              setOpenMenuId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
