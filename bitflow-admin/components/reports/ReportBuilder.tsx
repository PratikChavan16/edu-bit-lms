'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FileText, Download, Eye, Settings2, X, Save } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { SaveTemplateDialog } from './SaveTemplateDialog'

type ReportType = 'universities' | 'colleges' | 'users'
type PaperSize = 'a4' | 'letter' | 'legal'
type Orientation = 'portrait' | 'landscape'

interface FilterValue {
  [key: string]: any
}

interface ReportConfig {
  type: ReportType
  filters: FilterValue
  paperSize: PaperSize
  orientation: Orientation
}

const REPORT_TYPES = [
  { value: 'universities' as const, label: 'Universities Report', icon: '🏛️', description: 'Generate reports for all universities' },
  { value: 'colleges' as const, label: 'Colleges Report', icon: '🎓', description: 'Generate reports for colleges' },
  { value: 'users' as const, label: 'Users Report', icon: '👥', description: 'Generate reports for platform users' },
]

const PAPER_SIZES = [
  { value: 'a4' as const, label: 'A4', description: '210 × 297 mm (Standard)' },
  { value: 'letter' as const, label: 'Letter', description: '8.5 × 11 in (US)' },
  { value: 'legal' as const, label: 'Legal', description: '8.5 × 14 in (US Legal)' },
]

const ORIENTATIONS = [
  { value: 'portrait' as const, label: 'Portrait', icon: '📄' },
  { value: 'landscape' as const, label: 'Landscape', icon: '📃' },
]

// Simple filter definitions for each report type
const FILTER_DEFINITIONS = {
  universities: [
    { key: 'status', label: 'Status', type: 'multiselect' as const, options: ['active', 'inactive', 'suspended'] },
    { key: 'name', label: 'Name', type: 'text' as const },
  ],
  colleges: [
    { key: 'status', label: 'Status', type: 'multiselect' as const, options: ['active', 'inactive', 'suspended'] },
    { key: 'type', label: 'Type', type: 'multiselect' as const, options: ['engineering', 'medical', 'arts', 'science', 'commerce'] },
  ],
  users: [
    { key: 'role', label: 'Role', type: 'multiselect' as const, options: ['super_admin', 'university_owner', 'college_admin'] },
    { key: 'status', label: 'Status', type: 'multiselect' as const, options: ['active', 'inactive'] },
  ],
}

export function ReportBuilder() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'universities',
    filters: {},
    paperSize: 'a4',
    orientation: 'portrait',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    setReportConfig((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }))
  }

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...reportConfig.filters }
    delete newFilters[key]
    setReportConfig((prev) => ({ ...prev, filters: newFilters }))
  }

  const getActiveFiltersCount = () => {
    return Object.keys(reportConfig.filters).filter(key => {
      const value = reportConfig.filters[key]
      if (Array.isArray(value)) return value.length > 0
      return value !== '' && value !== null && value !== undefined
    }).length
  }

  const handleGenerateReport = async (download: boolean = true) => {
    setIsGenerating(true)
    try {
      const response: any = await apiClient.post(
        `/reports/${reportConfig.type}`,
        {
          filters: reportConfig.filters,
          options: {
            paper: reportConfig.paperSize,
            orientation: reportConfig.orientation,
            download,
          },
        }
      )

      // Create blob URL - response should be blob
      const blob = response.data
      const url = window.URL.createObjectURL(blob)

      if (download) {
        // Download the PDF
        const link = document.createElement('a')
        link.href = url
        link.download = `${reportConfig.type}_report_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // Open in new tab for preview
        window.open(url, '_blank')
      }

      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error('Failed to generate report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const currentFilters = FILTER_DEFINITIONS[reportConfig.type]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-7 w-7 text-blue-600" />
          Custom Report Builder
        </h2>
        <p className="text-gray-600 mt-1">
          Configure and generate professional PDF reports with custom filters and formatting
        </p>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Report Type & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Report Type Selection */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Report Type
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the type of report to generate
                </p>
              </div>

              <div className="space-y-2">
                {REPORT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() =>
                      setReportConfig((prev) => ({
                        ...prev,
                        type: type.value,
                        filters: {}, // Reset filters when changing type
                      }))
                    }
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      reportConfig.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>
                        {reportConfig.type === type.value && (
                          <Badge variant="default" className="mt-1">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Paper Settings */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Paper Size
                </Label>
              </div>

              <div className="space-y-2">
                {PAPER_SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() =>
                      setReportConfig((prev) => ({ ...prev, paperSize: size.value }))
                    }
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      reportConfig.paperSize === size.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{size.label}</div>
                    <div className="text-xs text-gray-500">{size.description}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Orientation
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {ORIENTATIONS.map((orient) => (
                  <button
                    key={orient.value}
                    onClick={() =>
                      setReportConfig((prev) => ({
                        ...prev,
                        orientation: orient.value,
                      }))
                    }
                    className={`p-3 rounded-lg border-2 transition-all ${
                      reportConfig.orientation === orient.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{orient.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{orient.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Filters & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Report Filters
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Filter which records to include
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="default" className="ml-2">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div className="pt-4 border-t space-y-4">
                  {currentFilters.map((filter) => (
                    <div key={filter.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{filter.label}</Label>
                        {reportConfig.filters[filter.key] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFilter(filter.key)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {filter.type === 'text' ? (
                        <Input
                          placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                          value={reportConfig.filters[filter.key] || ''}
                          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        />
                      ) : filter.type === 'multiselect' ? (
                        <div className="flex flex-wrap gap-2">
                          {filter.options?.map((option) => {
                            const isSelected = Array.isArray(reportConfig.filters[filter.key]) &&
                              reportConfig.filters[filter.key].includes(option)
                            return (
                              <button
                                key={option}
                                onClick={() => {
                                  const current = reportConfig.filters[filter.key] || []
                                  const newValue = isSelected
                                    ? current.filter((v: string) => v !== option)
                                    : [...current, option]
                                  handleFilterChange(filter.key, newValue)
                                }}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {option.replace('_', ' ')}
                              </button>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReportConfig(prev => ({ ...prev, filters: {} }))}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Report Summary */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Report Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Report Type:</span>
                  <div className="font-semibold text-gray-900 mt-1">
                    {REPORT_TYPES.find((t) => t.value === reportConfig.type)?.label}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Paper:</span>
                  <div className="font-semibold text-gray-900 mt-1">
                    {PAPER_SIZES.find((s) => s.value === reportConfig.paperSize)?.label} -{' '}
                    {reportConfig.orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Active Filters:</span>
                  <div className="font-semibold text-gray-900 mt-1">
                    {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Format:</span>
                  <div className="font-semibold text-gray-900 mt-1">
                    PDF Document
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSaveDialog(true)}
              variant="outline"
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Template
            </Button>
            <Button
              onClick={() => handleGenerateReport(false)}
              disabled={isGenerating}
              variant="outline"
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Preview PDF'}
            </Button>
            <Button
              onClick={() => handleGenerateReport(true)}
              disabled={isGenerating}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Save Template Dialog */}
      <SaveTemplateDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSuccess={() => {
          alert('Template saved successfully!')
        }}
        reportConfig={{
          type: reportConfig.type,
          filters: reportConfig.filters,
          options: {
            paper: reportConfig.paperSize,
            orientation: reportConfig.orientation,
          },
        }}
      />
    </div>
  )
}
