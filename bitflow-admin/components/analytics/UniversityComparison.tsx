'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { University } from '@/types'
import { BarChart, ChartCard } from '@/components/ui/Charts'
import { formatNumber, formatBytes, getStatusColor } from '@/lib/chart-utils'
import { Button } from '@/components/ui/button'
import { X, TrendingUp, TrendingDown, Minus, Building2, Users, HardDrive, Calendar } from 'lucide-react'

interface UniversityComparisonProps {
  initialUniversityIds?: string[]
  maxSelection?: number
}

interface UniversityStats extends University {
  colleges_count?: number
  users_count?: number
  students_count?: number
  storage_used_gb?: number
  active_users_count?: number
}

export function UniversityComparison({
  initialUniversityIds = [],
  maxSelection = 4,
}: UniversityComparisonProps) {
  const [universities, setUniversities] = useState<University[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>(initialUniversityIds)
  const [selectedUniversities, setSelectedUniversities] = useState<UniversityStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUniversities()
  }, [])

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchSelectedUniversities()
    } else {
      setSelectedUniversities([])
    }
  }, [selectedIds])

  const fetchUniversities = async () => {
    try {
      const response: any = await apiClient.get('/universities?per_page=100')
      const data = response.success ? (response.data?.universities || response.data || []) : []
      setUniversities(data)
    } catch (error) {
      console.error('Failed to fetch universities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSelectedUniversities = async () => {
    try {
      const promises = selectedIds.map((id) =>
        apiClient.get(`/universities/${id}`)
      )
      const responses = await Promise.all(promises)
      const data = responses.map((r: any) => r.success ? (r.data?.university || r.data) : null).filter(Boolean)
      setSelectedUniversities(data)
    } catch (error) {
      console.error('Failed to fetch university details:', error)
    }
  }

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else if (selectedIds.length < maxSelection) {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleClearAll = () => {
    setSelectedIds([])
  }

  // Prepare comparison data
  const comparisonData = {
    colleges: selectedUniversities.map((u) => ({
      name: u.name.substring(0, 20) + (u.name.length > 20 ? '...' : ''),
      value: u.colleges_count || 0,
    })),
    users: selectedUniversities.map((u) => ({
      name: u.name.substring(0, 20) + (u.name.length > 20 ? '...' : ''),
      value: u.users_count || 0,
    })),
    storage: selectedUniversities.map((u) => ({
      name: u.name.substring(0, 20) + (u.name.length > 20 ? '...' : ''),
      value: u.storage_used_gb || 0,
      'Used GB': u.storage_used_gb || 0,
      'Quota GB': u.storage_quota_gb || 100,
    })),
  }

  return (
    <div className="space-y-6">
      {/* University Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Universities to Compare</h3>
            <p className="text-sm text-gray-500 mt-1">
              Select up to {maxSelection} universities ({selectedIds.length}/{maxSelection} selected)
            </p>
          </div>
          {selectedIds.length > 0 && (
            <Button variant="outline" onClick={handleClearAll} size="sm">
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {universities.map((university) => {
            const isSelected = selectedIds.includes(university.id)
            const canSelect = selectedIds.length < maxSelection || isSelected

            return (
              <button
                key={university.id}
                onClick={() => canSelect && handleSelect(university.id)}
                disabled={!canSelect}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : canSelect
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{university.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{university.domain}</p>
                  </div>
                  {isSelected && (
                    <div className="ml-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <X className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span
                    className={`
                      px-2 py-0.5 rounded-full font-medium
                      ${
                        university.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : university.status === 'suspended'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {university.status}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Comparison View */}
      {selectedUniversities.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedUniversities.map((university) => (
              <div
                key={university.id}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{university.name}</h4>
                  <button
                    onClick={() => handleSelect(university.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Colleges:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(university.colleges_count || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500">Users:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(university.users_count || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-gray-500">Storage:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatBytes((university.storage_used_gb || 0) * 1024 * 1024 * 1024)} / {university.storage_quota_gb}GB
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    <span className="text-xs text-gray-500">Est:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {university.established_year || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Storage Usage Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Storage Usage</span>
                    <span>
                      {university.storage_used_gb && university.storage_quota_gb
                        ? ((university.storage_used_gb / university.storage_quota_gb) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{
                        width: `${
                          university.storage_used_gb && university.storage_quota_gb
                            ? Math.min((university.storage_used_gb / university.storage_quota_gb) * 100, 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Colleges Comparison"
              description="Number of colleges per university"
            >
              <BarChart
                data={comparisonData.colleges}
                height={250}
                colors={['#3B82F6']}
                formatter={formatNumber}
              />
            </ChartCard>

            <ChartCard
              title="Users Comparison"
              description="Total users per university"
            >
              <BarChart
                data={comparisonData.users}
                height={250}
                colors={['#10B981']}
                formatter={formatNumber}
              />
            </ChartCard>
          </div>

          {/* Storage Comparison */}
          <ChartCard
            title="Storage Comparison"
            description="Storage used vs quota for each university"
          >
            <BarChart
              data={comparisonData.storage}
              dataKeys={['Used GB', 'Quota GB']}
              height={300}
              colors={['#8B5CF6', '#E5E7EB']}
              formatter={(value) => `${value} GB`}
            />
          </ChartCard>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Comparison</h3>
              <p className="text-sm text-gray-500 mt-1">
                Side-by-side metrics for selected universities
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    {selectedUniversities.map((university) => (
                      <th
                        key={university.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {university.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Status
                    </td>
                    {selectedUniversities.map((university) => (
                      <td key={university.id} className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${
                              university.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : university.status === 'suspended'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          {university.status}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Colleges
                    </td>
                    {selectedUniversities.map((university) => (
                      <td key={university.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(university.colleges_count || 0)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total Users
                    </td>
                    {selectedUniversities.map((university) => (
                      <td key={university.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(university.users_count || 0)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Storage Used
                    </td>
                    {selectedUniversities.map((university) => (
                      <td key={university.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatBytes((university.storage_used_gb || 0) * 1024 * 1024 * 1024)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Storage Quota
                    </td>
                    {selectedUniversities.map((university) => (
                      <td key={university.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {university.storage_quota_gb} GB
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Established
                    </td>
                    {selectedUniversities.map((university) => (
                      <td key={university.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {university.established_year || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Domain
                    </td>
                    {selectedUniversities.map((university) => (
                      <td key={university.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {university.domain}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {selectedIds.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Universities Selected</h3>
          <p className="text-gray-500">
            Select at least 2 universities above to see comparison charts and metrics
          </p>
        </div>
      )}
    </div>
  )
}
