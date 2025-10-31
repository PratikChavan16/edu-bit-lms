'use client'

import { useState } from 'react'
import { X, Calendar, Mail, Filter, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api-client'

interface ScheduleReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type ReportType = 'universities' | 'colleges' | 'users'
type PaperSize = 'a4' | 'letter' | 'legal'
type Orientation = 'portrait' | 'landscape'
type FilterValue = { [key: string]: any }

interface ScheduleConfig {
  name: string
  description: string
  reportType: ReportType
  filters: FilterValue
  paperSize: PaperSize
  orientation: Orientation
  cronExpression: string
  frequencyLabel: string
  recipients: string[]
  emailSubject: string
  emailMessage: string
}

// Common cron presets
const CRON_PRESETS = [
  { label: 'Every Day at 9:00 AM', cron: '0 9 * * *', icon: '📅' },
  { label: 'Every Monday at 9:00 AM', cron: '0 9 * * 1', icon: '📆' },
  { label: 'First Day of Month at 9:00 AM', cron: '0 9 1 * *', icon: '🗓️' },
  { label: 'Every Friday at 5:00 PM', cron: '0 17 * * 5', icon: '📊' },
  { label: 'Every Hour', cron: '0 * * * *', icon: '⏰' },
]

export function ScheduleReportModal({ isOpen, onClose, onSuccess }: ScheduleReportModalProps) {
  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [recipientInput, setRecipientInput] = useState('')

  const [config, setConfig] = useState<ScheduleConfig>({
    name: '',
    description: '',
    reportType: 'universities',
    filters: {},
    paperSize: 'a4',
    orientation: 'portrait',
    cronExpression: '0 9 * * 1', // Default: Monday 9 AM
    frequencyLabel: 'Every Monday at 9:00 AM',
    recipients: [],
    emailSubject: '',
    emailMessage: '',
  })

  if (!isOpen) return null

  const handleAddRecipient = () => {
    const email = recipientInput.trim()
    if (!email) return

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      return
    }

    if (config.recipients.includes(email)) {
      alert('This email is already added')
      return
    }

    setConfig({ ...config, recipients: [...config.recipients, email] })
    setRecipientInput('')
  }

  const handleRemoveRecipient = (email: string) => {
    setConfig({
      ...config,
      recipients: config.recipients.filter((r) => r !== email),
    })
  }

  const handleSelectPreset = (preset: typeof CRON_PRESETS[0]) => {
    setConfig({
      ...config,
      cronExpression: preset.cron,
      frequencyLabel: preset.label,
    })
  }

  const handleSave = async () => {
    // Validation
    if (!config.name.trim()) {
      alert('Please enter a schedule name')
      return
    }

    if (config.recipients.length === 0) {
      alert('Please add at least one recipient email')
      return
    }

    setIsSaving(true)

    try {
      await apiClient.post('/scheduled-reports', {
        name: config.name,
        description: config.description,
        report_type: config.reportType,
        filters: config.filters,
        options: {
          paper: config.paperSize,
          orientation: config.orientation,
        },
        cron_expression: config.cronExpression,
        frequency_label: config.frequencyLabel,
        recipients: config.recipients,
        email_subject: config.emailSubject || `${config.name} - Scheduled Report`,
        email_message:
          config.emailMessage ||
          `Please find attached the scheduled report: ${config.name}`,
      })

      alert('Scheduled report created successfully!')
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      console.error('Failed to create scheduled report:', error)
      alert('Failed to create scheduled report. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setConfig({
      name: '',
      description: '',
      reportType: 'universities',
      filters: {},
      paperSize: 'a4',
      orientation: 'portrait',
      cronExpression: '0 9 * * 1',
      frequencyLabel: 'Every Monday at 9:00 AM',
      recipients: [],
      emailSubject: '',
      emailMessage: '',
    })
    setRecipientInput('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Schedule Report</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {step} of 4: {step === 1 ? 'Basic Info' : step === 2 ? 'Report Configuration' : step === 3 ? 'Schedule' : 'Recipients'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 px-6 pt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Schedule Name *</Label>
                <Input
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  placeholder="e.g., Weekly Universities Report"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  placeholder="What is this report for?"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <Label>Report Type *</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { type: 'universities' as ReportType, label: 'Universities', icon: '🏛️' },
                    { type: 'colleges' as ReportType, label: 'Colleges', icon: '🎓' },
                    { type: 'users' as ReportType, label: 'Users', icon: '👥' },
                  ].map((rt) => (
                    <button
                      key={rt.type}
                      onClick={() => setConfig({ ...config, reportType: rt.type })}
                      className={`p-4 border-2 rounded-lg text-center hover:border-blue-600 transition ${
                        config.reportType === rt.type
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">{rt.icon}</div>
                      <div className="font-medium">{rt.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Report Configuration */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Paper Size</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { size: 'a4' as PaperSize, label: 'A4' },
                    { size: 'letter' as PaperSize, label: 'Letter' },
                    { size: 'legal' as PaperSize, label: 'Legal' },
                  ].map((ps) => (
                    <button
                      key={ps.size}
                      onClick={() => setConfig({ ...config, paperSize: ps.size })}
                      className={`p-3 border-2 rounded-lg text-center ${
                        config.paperSize === ps.size
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {ps.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Orientation</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { orientation: 'portrait' as Orientation, label: 'Portrait' },
                    { orientation: 'landscape' as Orientation, label: 'Landscape' },
                  ].map((or) => (
                    <button
                      key={or.orientation}
                      onClick={() => setConfig({ ...config, orientation: or.orientation })}
                      className={`p-3 border-2 rounded-lg text-center ${
                        config.orientation === or.orientation
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {or.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <Filter className="inline h-4 w-4 mr-1" />
                  Filters can be configured after creating the schedule
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Frequency Presets</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {CRON_PRESETS.map((preset) => (
                    <button
                      key={preset.cron}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 border-2 rounded-lg text-left flex items-center gap-3 hover:border-blue-600 transition ${
                        config.cronExpression === preset.cron
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="text-2xl">{preset.icon}</span>
                      <span className="font-medium">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Custom Cron Expression (Advanced)</Label>
                <Input
                  value={config.cronExpression}
                  onChange={(e) => setConfig({ ...config, cronExpression: e.target.value })}
                  placeholder="e.g., 0 9 * * 1"
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: minute hour day month weekday
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {config.frequencyLabel || 'Custom schedule'}
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Recipients */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label>Email Recipients *</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddRecipient()
                      }
                    }}
                    placeholder="Enter email address"
                    type="email"
                    className="flex-1"
                  />
                  <Button onClick={handleAddRecipient} type="button">
                    Add
                  </Button>
                </div>

                {config.recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {config.recipients.map((email) => (
                      <Badge
                        key={email}
                        variant="default"
                        className="px-3 py-1 flex items-center gap-2"
                      >
                        <Mail className="h-3 w-3" />
                        {email}
                        <button
                          onClick={() => handleRemoveRecipient(email)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Email Subject (Optional)</Label>
                <Input
                  value={config.emailSubject}
                  onChange={(e) => setConfig({ ...config, emailSubject: e.target.value })}
                  placeholder={`${config.name} - Scheduled Report`}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Email Message (Optional)</Label>
                <textarea
                  value={config.emailMessage}
                  onChange={(e) => setConfig({ ...config, emailMessage: e.target.value })}
                  placeholder={`Please find attached the scheduled report: ${config.name}`}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Creating...' : 'Create Schedule'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
