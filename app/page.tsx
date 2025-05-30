'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserTypeSelection from '@/components/auth/UserTypeSelection'

export default function Home() {
  const { state } = useApp()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (state.currentUser && !isRedirecting) {
      setIsRedirecting(true)
      
      // Add a slight delay to show loading state
      const timer = setTimeout(() => {
        // Redirect to appropriate dashboard based on user type
        switch (state.currentUser.type) {
          case 'buyer':
            router.push('/buyer/dashboard')
            break
          case 'supplier':
            router.push('/supplier/dashboard')
            break
          case 'rider':
            router.push('/rider/dashboard')
            break
          default:
            setIsRedirecting(false)
            break
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [state.currentUser, router, isRedirecting])

  if (state.currentUser && isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Redirecting to your dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Welcome back, {state.currentUser.name}!</p>
        </div>
      </div>
    )
  }

  return <UserTypeSelection />
}
