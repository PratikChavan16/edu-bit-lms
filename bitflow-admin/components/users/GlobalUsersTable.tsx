'use client'

import { useState } from 'react'
import { GlobalUser } from '@/types'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { MoreVertical, Eye, Lock, Unlock, Key, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface GlobalUsersTableProps {
  users: GlobalUser[]
  loading?: boolean
  onViewDetails?: (user: GlobalUser) => void
  onResetPassword?: (user: GlobalUser) => void
  onToggleLock?: (user: GlobalUser) => void
  onDelete?: (user: GlobalUser) => void
}

export default function GlobalUsersTable({
  users,
  loading = false,
  onViewDetails,
  onResetPassword,
  onToggleLock,
  onDelete,
}: GlobalUsersTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const getStatusBadge = (status: GlobalUser['status']) => {
    const variants: Record<GlobalUser['status'], 'success' | 'warning' | 'danger' | 'default'> = {
      active: 'success',
      inactive: 'warning',
      locked: 'danger',
      suspended: 'danger',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-lg">No users found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search criteria</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{user.email}</span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {typeof user.role === 'string' ? user.role : 'Unknown'}
                </span>
              </TableCell>
              <TableCell>
                {user.university ? (
                  <span className="text-sm text-gray-600">{user.university.name}</span>
                ) : (
                  <span className="text-sm text-gray-400 italic">Platform User</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {user.last_login ? formatDateTime(user.last_login) : 'Never'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="relative inline-block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDropdown(user.id)}
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {openDropdownId === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => {
                          onViewDetails?.(user)
                          setOpenDropdownId(null)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          onResetPassword?.(user)
                          setOpenDropdownId(null)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Reset Password
                      </button>
                      <button
                        onClick={() => {
                          onToggleLock?.(user)
                          setOpenDropdownId(null)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {user.status === 'locked' ? (
                          <>
                            <Unlock className="h-4 w-4 mr-2" />
                            Unlock User
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Lock User
                          </>
                        )}
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          onDelete?.(user)
                          setOpenDropdownId(null)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </button>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
