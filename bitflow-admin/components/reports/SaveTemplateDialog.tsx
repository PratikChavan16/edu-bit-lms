'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/lib/api-client'

interface SaveTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  reportConfig: {
    type: string
    filters: any
    options: any
  }
}

const TEMPLATE_ICONS = ['📊', '📈', '📉', '📑', '📄', '📋', '📝', '📚', '🏛️', '🎓', '👥', '💼', '📁', '🗂️', '📇']
const TEMPLATE_COLORS = ['blue', 'purple', 'green', 'red', 'orange', 'yellow', 'indigo', 'teal']

export function SaveTemplateDialog({ isOpen, onClose, onSuccess, reportConfig }: SaveTemplateDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    icon: '📊',
    color: 'blue',
    is_public: false,
  })

  if (!isOpen) return null

  const handleSave = async () => {
    if (!templateData.name.trim()) {
      alert('Please enter a template name')
      return
    }

    setIsSaving(true)

    try {
      await apiClient.post('/report-templates', {
        name: templateData.name,
        description: templateData.description,
        category: 'custom',
        report_type: reportConfig.type,
        filters: reportConfig.filters,
        options: reportConfig.options,
        icon: templateData.icon,
        color: templateData.color,
        is_public: templateData.is_public,
      })

      alert('Template saved successfully!')
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      console.error('Failed to save template:', error)
      alert('Failed to save template. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setTemplateData({
      name: '',
      description: '',
      icon: '📊',
      color: 'blue',
      is_public: false,
    })
  }

  const getColorClass = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      indigo: 'bg-indigo-500',
      teal: 'bg-teal-500',
    }
    return colors[color] || 'bg-gray-500'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Save className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Save as Template</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label>Template Name *</Label>
            <Input
              value={templateData.name}
              onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
              placeholder="e.g., Monthly Active Universities"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <textarea
              value={templateData.description}
              onChange={(e) => setTemplateData({ ...templateData, description: e.target.value })}
              placeholder="What is this template for?"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>

          <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {TEMPLATE_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setTemplateData({ ...templateData, icon })}
                  className={`p-2 text-2xl border-2 rounded-md hover:border-blue-600 transition ${
                    templateData.icon === icon ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Color Theme</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {TEMPLATE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setTemplateData({ ...templateData, color })}
                  className={`h-10 rounded-md border-2 transition ${
                    templateData.color === color ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900' : 'border-gray-200'
                  } ${getColorClass(color)}`}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_public"
              checked={templateData.is_public}
              onChange={(e) => setTemplateData({ ...templateData, is_public: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="is_public" className="text-sm text-gray-700 cursor-pointer">
              Make this template public (visible to other users in your university)
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            <strong>Template will save:</strong>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>Report type: {reportConfig.type}</li>
              <li>All current filters</li>
              <li>Paper size and orientation</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
