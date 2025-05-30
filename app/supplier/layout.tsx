'use client'

import type React from 'react'
import { usePathname } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DriverAuthProvider } from '@/contexts/DriverAuthContext'

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
      <DriverAuthProvider>
        {children}
      </DriverAuthProvider>
    )
  }

  return (
    <DriverAuthProvider>
      <DashboardLayout userType="supplier">
        {children}
      </DashboardLayout>
    </DriverAuthProvider>
  )
}
