'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { state } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!state.currentUser) {
      router.push('/')
    } else if (state.currentUser.type !== 'supplier') {
      // Redirect to appropriate dashboard
      router.push(`/${state.currentUser.type}/dashboard`)
    }
  }, [state.currentUser, router])

  if (!state.currentUser || state.currentUser.type !== 'supplier') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout userType="supplier">
      {children}
    </DashboardLayout>
  )
}
