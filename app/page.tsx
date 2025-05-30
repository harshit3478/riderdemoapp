"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import UserTypeSelection from "@/components/auth/UserTypeSelection"

export default function Home() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser())

  useEffect(() => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)

    if (user && !isRedirecting) {
      setIsRedirecting(true)

      // Add a slight delay to show loading state
      const timer = setTimeout(() => {
        // Redirect to appropriate dashboard based on user type
        switch (user.type) {
          case "buyer":
            router.push("/buyer/dashboard")
            break
          case "supplier":
            router.push("/supplier/dashboard")
            break
          case "rider":
            router.push("/rider/dashboard")
            break
          case "admin":
            router.push("/admin/dashboard")
            break
          default:
            setIsRedirecting(false)
            break
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [router, isRedirecting])

  if (currentUser && isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Redirecting to your dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Welcome back, {currentUser.name}!</p>
        </div>
      </div>
    )
  }

  return <UserTypeSelection />
}
