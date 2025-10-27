'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/stores/auth-store'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const loadUser = useAuthStore((state) => state.loadUser)
  const isLoginPage = pathname === '/login'

  useEffect(() => {
    loadUser()
  }, [loadUser])

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
