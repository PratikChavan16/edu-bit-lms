'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/toast'
import type { ApiResponse } from '@/types'
import { Save, Key, Plus, Trash2 } from 'lucide-react'

export default function APISettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState({
    globalRateLimit: 10000,
    requireApiKey: true,
    allowedOrigins: ['https://app.bitflow.edu'],
  })
  const [newOrigin, setNewOrigin] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/admin/settings')
      if (response.data?.api) {
        setSettings(response.data.api)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await apiClient.patch('/admin/settings/api', settings)
      toast.success('API settings saved successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const addOrigin = () => {
    if (newOrigin && !settings.allowedOrigins.includes(newOrigin)) {
      setSettings({
        ...settings,
        allowedOrigins: [...settings.allowedOrigins, newOrigin],
      })
      setNewOrigin('')
    }
  }

  const removeOrigin = (origin: string) => {
    setSettings({
      ...settings,
      allowedOrigins: settings.allowedOrigins.filter((o) => o !== origin),
    })
  }

  if (isLoading) {
    return <Card><CardContent className="py-8">Loading...</CardContent></Card>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Global Rate Limit (requests/hour)
            </label>
            <input
              type="number"
              value={settings.globalRateLimit}
              onChange={(e) =>
                setSettings({ ...settings, globalRateLimit: parseInt(e.target.value) })
              }
              min="1000"
              max="1000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireApiKey}
                onChange={(e) =>
                  setSettings({ ...settings, requireApiKey: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">Require API Key</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Origins (CORS)
            </label>
            <div className="space-y-2">
              {settings.allowedOrigins.map((origin) => (
                <div
                  key={origin}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span className="text-sm">{origin}</span>
                  <button
                    onClick={() => removeOrigin(origin)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newOrigin}
                onChange={(e) => setNewOrigin(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addOrigin()}
              />
              <Button variant="outline" onClick={addOrigin}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
