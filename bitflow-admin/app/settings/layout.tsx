'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const settingsTabs = [
  { id: 'general', label: 'General', href: '/settings/general' },
  { id: 'email', label: 'Email', href: '/settings/email' },
  { id: 'sms', label: 'SMS', href: '/settings/sms' },
  { id: 'payment', label: 'Payment', href: '/settings/payment' },
  { id: 'storage', label: 'Storage', href: '/settings/storage' },
  { id: 'security', label: 'Security', href: '/settings/security' },
  { id: 'api', label: 'API', href: '/settings/api' },
]

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Global Platform Settings</h1>
        <p className="text-gray-500 mt-1">
          Configure platform-wide settings and integrations
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1 overflow-x-auto">
          {settingsTabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div>{children}</div>
    </div>
  )
}
