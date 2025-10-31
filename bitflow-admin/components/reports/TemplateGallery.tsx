'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Copy, Trash2, Star, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api-client'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  report_type: string
  filters: any
  options: any
  icon: string
  color: string
  is_public: boolean
  is_system: boolean
  usage_count: number
  last_used_at: string | null
  creator: {
    name: string
    email: string
  }
}

interface TemplateGalleryProps {
  onTemplateSelect?: (template: ReportTemplate) => void
  onGenerateFromTemplate?: (template: ReportTemplate) => void
}

export function TemplateGallery({ onTemplateSelect, onGenerateFromTemplate }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'custom' | 'popular'>('all')

  useEffect(() => {
    fetchTemplates()
  }, [activeTab])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      let url = '/report-templates'
      
      if (activeTab === 'system') {
        url += '?is_system=true'
      } else if (activeTab === 'custom') {
        url += '?is_system=false'
      } else if (activeTab === 'popular') {
        url = '/report-templates/popular?limit=20'
      }

      const response: any = await apiClient.get(url)
      setTemplates(response.data.data || response.data)
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = async (template: ReportTemplate) => {
    try {
      await apiClient.post(`/report-templates/${template.id}/duplicate`)
      alert('Template duplicated successfully!')
      fetchTemplates()
    } catch (error) {
      console.error('Failed to duplicate template:', error)
      alert('Failed to duplicate template')
    }
  }

  const handleDelete = async (template: ReportTemplate) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return
    }

    try {
      await apiClient.delete(`/report-templates/${template.id}`)
      alert('Template deleted successfully!')
      fetchTemplates()
    } catch (error) {
      console.error('Failed to delete template:', error)
      alert('Failed to delete template')
    }
  }

  const getColorClass = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      teal: 'bg-teal-100 text-teal-800 border-teal-300',
    }
    return colors[color] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading templates...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="inline h-4 w-4 mr-2" />
          All Templates
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'system'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Star className="inline h-4 w-4 mr-2" />
          System Templates
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'custom'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Clock className="inline h-4 w-4 mr-2" />
          My Templates
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'popular'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="inline h-4 w-4 mr-2" />
          Popular
        </button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Templates Found</h3>
          <p className="text-gray-500">
            {activeTab === 'custom' 
              ? 'Create your first custom template to get started.'
              : 'No templates available in this category.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className={`p-4 border-2 ${getColorClass(template.color)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.icon || '📄'}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                    {template.is_system && (
                      <Badge variant="default" className="mt-1 text-xs">
                        System
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs mb-3 line-clamp-2 h-8">{template.description}</p>

              <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                <Badge variant="info" className="text-xs">
                  {template.report_type.charAt(0).toUpperCase() + template.report_type.slice(1)}
                </Badge>
                {template.usage_count > 0 && (
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {template.usage_count}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onGenerateFromTemplate && onGenerateFromTemplate(template)}
                  className="flex-1 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Generate
                </Button>
                
                {!template.is_system && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(template)}
                    className="text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicate(template)}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
