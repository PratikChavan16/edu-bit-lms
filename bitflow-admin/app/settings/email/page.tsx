'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/ui/toast'
import type { ApiResponse } from '@/types'
import { Save, Mail } from 'lucide-react'

interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  fromAddress: string
}

export default function EmailSettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromAddress: 'noreply@bitflow.edu',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/admin/settings')
      if (response.data?.email) {
        setSettings(response.data.email)
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
      await apiClient.patch('/admin/settings/email', settings)
      toast.success('Email settings saved successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    try {
      setIsTesting(true)
      await apiClient.post('/admin/settings/email/test', settings)
      toast.success('Test email sent successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Connection test failed')
    } finally {
      setIsTesting(false)
    }
  }

  const handleChange = (field: keyof EmailSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return <Card><CardContent className="py-8">Loading...</CardContent></Card>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Settings (SMTP)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => handleChange('smtpHost', e.target.value)}
              placeholder="smtp.sendgrid.net"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtpPort}
              onChange={(e) => handleChange('smtpPort', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.smtpUsername}
              onChange={(e) => handleChange('smtpUsername', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => handleChange('smtpPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Address
            </label>
            <input
              type="email"
              value={settings.fromAddress}
              onChange={(e) => handleChange('fromAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline" onClick={handleTest} disabled={isTesting}>
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
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
