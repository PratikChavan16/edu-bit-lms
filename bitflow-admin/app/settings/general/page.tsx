'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/toast'
import type { ApiResponse } from '@/types'
import { Save } from 'lucide-react'

interface GeneralSettings {
  platformName: string
  supportEmail: string
  supportPhone: string
  timezone: string
  maintenanceMode: boolean
  defaultStorageQuotaGB: number
  defaultApiRateLimit: number
  trialPeriodDays: number
}

export default function GeneralSettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState<GeneralSettings>({
    platformName: 'Bitflow LMS',
    supportEmail: 'support@bitflow.edu',
    supportPhone: '+1-800-BITFLOW',
    timezone: 'UTC-5:00',
    maintenanceMode: false,
    defaultStorageQuotaGB: 500,
    defaultApiRateLimit: 10000,
    trialPeriodDays: 30,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get<ApiResponse<{ general: GeneralSettings }>>(
        '/admin/settings'
      )
      if (response.data.general) {
        setSettings(response.data.general)
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
      await apiClient.patch('/admin/settings/general', settings)
      toast.success('General settings saved successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: keyof GeneralSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Platform Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => handleChange('platformName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Phone
                </label>
                <input
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(e) => handleChange('supportPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC-5:00">UTC -5:00 (Eastern Time)</option>
                  <option value="UTC-6:00">UTC -6:00 (Central Time)</option>
                  <option value="UTC-7:00">UTC -7:00 (Mountain Time)</option>
                  <option value="UTC-8:00">UTC -8:00 (Pacific Time)</option>
                  <option value="UTC+0:00">UTC +0:00 (GMT)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </span>
              </div>
            </div>
          </div>

          {/* Default Settings for New Universities */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Default Settings for New Universities
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Quota (GB)
                </label>
                <input
                  type="number"
                  value={settings.defaultStorageQuotaGB}
                  onChange={(e) =>
                    handleChange('defaultStorageQuotaGB', parseInt(e.target.value))
                  }
                  min="50"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Rate Limit (requests/hour)
                </label>
                <input
                  type="number"
                  value={settings.defaultApiRateLimit}
                  onChange={(e) =>
                    handleChange('defaultApiRateLimit', parseInt(e.target.value))
                  }
                  min="1000"
                  max="100000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trial Period (days)
                </label>
                <input
                  type="number"
                  value={settings.trialPeriodDays}
                  onChange={(e) =>
                    handleChange('trialPeriodDays', parseInt(e.target.value))
                  }
                  min="7"
                  max="90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
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
