'use client'

import type React from 'react'
import { usePathname } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { RiderAuthProvider } from '@/contexts/RiderAuthContext'

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // For login and register pages, don't wrap with DashboardLayout
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register')

  if (isAuthPage) {
    return (
      <RiderAuthProvider>
        {children}
      </RiderAuthProvider>
    )
  }

  return (
    <RiderAuthProvider>
      <DashboardLayout userType="rider">
        {children}
      </DashboardLayout>
    </RiderAuthProvider>
  )
}
