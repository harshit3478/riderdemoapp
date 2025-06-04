'use client'

import type React from 'react'
import { usePathname } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FleetAuthProvider } from '@/contexts/FleetAuthContext'

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // For login and register pages, don't wrap with DashboardLayout
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register')

  if (isAuthPage) {
    return (
      <FleetAuthProvider>
        {children}
      </FleetAuthProvider>
    )
  }

  return (
    <FleetAuthProvider>
      <DashboardLayout userType="supplier">
        {children}
      </DashboardLayout>
    </FleetAuthProvider>
  )
}
