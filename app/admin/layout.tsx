"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { AdminAuthProvider } from "@/contexts/AdminAuthContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // For login and register pages, don't wrap with DashboardLayout
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register')

  if (isAuthPage) {
    return (
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    )
  }

  return (
    <AdminAuthProvider>
      <DashboardLayout userType="admin">
        {children}
      </DashboardLayout>
    </AdminAuthProvider>
  )
}
