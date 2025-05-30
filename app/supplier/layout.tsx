'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/utils'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(auth.getCurrentUser())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])
  

  if (isLoading || !currentUser || currentUser.type !== 'supplier') {
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
