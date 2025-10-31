'use client'

import { useState } from 'react'
import { ReportBuilder } from '@/components/reports/ReportBuilder'
import { ScheduleReportModal } from '@/components/reports/ScheduleReportModal'
import { ScheduledReportsList } from '@/components/reports/ScheduledReportsList'
import { TemplateGallery } from '@/components/reports/TemplateGallery'
import { ReportHistory } from '@/components/reports/ReportHistory'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, FileText, Layout, History } from 'lucide-react'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'scheduled' | 'templates' | 'history'>('generate')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and manage PDF reports</p>
        </div>
        {activeTab === 'scheduled' && (
          <Button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            New Schedule
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'generate'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="inline h-4 w-4 mr-2" />
          Generate Report
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'templates'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layout className="inline h-4 w-4 mr-2" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'scheduled'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="inline h-4 w-4 mr-2" />
          Scheduled Reports
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="inline h-4 w-4 mr-2" />
          History
        </button>
      </div>

      {/* Content */}
      {activeTab === 'generate' && <ReportBuilder />}
      {activeTab === 'templates' && <TemplateGallery />}
      {activeTab === 'scheduled' && <ScheduledReportsList refreshTrigger={refreshTrigger} />}
      {activeTab === 'history' && <ReportHistory />}

      {/* Schedule Modal */}
      <ScheduleReportModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSuccess={() => {
          setRefreshTrigger((prev) => prev + 1)
          setActiveTab('scheduled')
        }}
      />
    </div>
  )
}
