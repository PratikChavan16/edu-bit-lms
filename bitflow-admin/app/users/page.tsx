'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalUser, CreatePlatformUserRequest, PaginatedResponse } from '@/types'
import { useToast } from '@/components/ui/toast'
import GlobalUsersTable from '@/components/users/GlobalUsersTable'
import UserDetailsModal from '@/components/users/UserDetailsModal'
import CreatePlatformUserModal from '@/components/users/CreatePlatformUserModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import { Users, UserCheck, Lock, UserCog, Search, Plus } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export default function UsersPage() {
  const router = useRouter()
  const toast = useToast()
  const [users, setUsers] = useState<GlobalUser[]>([])
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [total, setTotal] = useState(0)

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    locked: 0,
    byRole: {
      bitflow_owner: 0,
      bitflow_staff: 0,
      support_agent: 0,
      university_owner: 0,
      other: 0,
    },
  })

  useEffect(() => {
    fetchUsers()
  }, [currentPage, perPage, searchQuery, roleFilter, statusFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      })

      if (searchQuery) params.append('search', searchQuery)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await apiClient.get<PaginatedResponse<GlobalUser>>(
        `/admin/users?${params.toString()}`
      )

      setUsers(response.data)
      setCurrentPage(response.meta.current_page)
      setTotalPages(response.meta.last_page)
      setTotal(response.meta.total)

      // Calculate stats
      calculateStats(response.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (usersList: GlobalUser[]) => {
    const totalUsers = usersList.length
    const activeUsers = usersList.filter((u) => u.status === 'active').length
    const lockedUsers = usersList.filter((u) => u.status === 'locked').length

    const roleCount = {
      bitflow_owner: usersList.filter((u) => u.role === 'bitflow_owner').length,
      bitflow_staff: usersList.filter((u) => u.role === 'bitflow_staff').length,
      support_agent: usersList.filter((u) => u.role === 'support_agent').length,
      university_owner: usersList.filter((u) => u.role === 'university_owner').length,
      other: usersList.filter(
        (u) =>
          !['bitflow_owner', 'bitflow_staff', 'support_agent', 'university_owner'].includes(u.role)
      ).length,
    }

    setStats({
      total: totalUsers,
      active: activeUsers,
      locked: lockedUsers,
      byRole: roleCount,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const handleCreateUser = async (data: CreatePlatformUserRequest) => {
    try {
      await apiClient.post('/admin/users', data)
      toast.success(`User "${data.name}" created successfully`)
      fetchUsers()
      setIsCreateModalOpen(false)
    } catch (error) {
      throw error
    }
  }

  const handleViewDetails = (user: GlobalUser) => {
    setSelectedUser(user)
    setIsDetailsModalOpen(true)
  }

  const handleResetPassword = async (user: GlobalUser) => {
    if (!confirm(`Send password reset email to ${user.email}?`)) return

    try {
      await apiClient.post(`/admin/users/${user.id}/reset-password`)
      toast.success(`Password reset email sent to ${user.email}`)
    } catch (error) {
      toast.error('Failed to send password reset email')
    }
  }

  const handleToggleLock = async (user: GlobalUser) => {
    const newStatus = user.status === 'locked' ? 'active' : 'locked'
    const action = newStatus === 'locked' ? 'lock' : 'unlock'

    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return

    try {
      await apiClient.patch(`/admin/users/${user.id}/status`, { status: newStatus })
      toast.success(`User ${action}ed successfully`)
      fetchUsers()
    } catch (error) {
      toast.error(`Failed to ${action} user`)
    }
  }

  const handleDeleteUser = async (user: GlobalUser) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`))
      return

    try {
      await apiClient.delete(`/admin/users/${user.id}`)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">
            Manage platform-level users across all universities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locked Users</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.locked}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Admins</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.byRole.bitflow_owner}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCog className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="bitflow_owner">Bitflow Owner</option>
              <option value="university_owner">University Owner</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Create User Button */}
            <Button onClick={() => setIsCreateModalOpen(true)} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <GlobalUsersTable
            users={users}
            loading={loading}
            onViewDetails={handleViewDetails}
            onResetPassword={handleResetPassword}
            onToggleLock={handleToggleLock}
            onDelete={handleDeleteUser}
          />

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={perPage}
                onItemsPerPageChange={setPerPage}
                totalItems={total}
              />
            </div>
          )}
        </Card>

        {/* Modals */}
        <UserDetailsModal
          user={selectedUser}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />

        <CreatePlatformUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateUser}
        />
      </div>
    </div>
  )
}
