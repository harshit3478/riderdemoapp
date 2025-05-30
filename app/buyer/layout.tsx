"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { RestaurantAuthProvider } from "@/contexts/RestaurantAuthContext"

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // For login and register pages, don't wrap with DashboardLayout
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register')

  if (isAuthPage) {
    return (
      <RestaurantAuthProvider>
        {children}
      </RestaurantAuthProvider>
    )
  }

  return (
    <RestaurantAuthProvider>
      <DashboardLayout userType="buyer">
        {children}
      </DashboardLayout>
    </RestaurantAuthProvider>
  )
}
