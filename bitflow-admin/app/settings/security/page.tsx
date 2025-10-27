'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/toast'
import type { ApiResponse } from '@/types'
import { Save, Shield } from 'lucide-react'

export default function SecuritySettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    sessionTimeoutMinutes: 60,
    maxFailedLoginAttempts: 5,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/admin/settings')
      if (response.data?.security) {
        setSettings(response.data.security)
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
      await apiClient.patch('/admin/settings/security', settings)
      toast.success('Security settings saved successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <Card><CardContent className="py-8">Loading...</CardContent></Card>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Password Policies</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) =>
                    setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })
                  }
                  min="8"
                  max="128"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireUppercase}
                    onChange={(e) =>
                      setSettings({ ...settings, passwordRequireUppercase: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Require uppercase letters
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireNumbers}
                    onChange={(e) =>
                      setSettings({ ...settings, passwordRequireNumbers: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Require numbers</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireSpecial}
                    onChange={(e) =>
                      setSettings({ ...settings, passwordRequireSpecial: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Require special characters
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Session & Login</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sessionTimeoutMinutes: parseInt(e.target.value),
                    })
                  }
                  min="5"
                  max="1440"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Failed Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.maxFailedLoginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxFailedLoginAttempts: parseInt(e.target.value),
                    })
                  }
                  min="3"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
