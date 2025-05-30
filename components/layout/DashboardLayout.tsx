"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import type { UserType } from "@/lib/types"
import { Home, Plus, FileText, Users, LogOut, Menu, X, Bell, Search, User, Shield } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: UserType
}

const navigationItems = {
  buyer: [
    { icon: Home, label: "Dashboard", href: "/buyer/dashboard" },
    { icon: Plus, label: "Post Requirement", href: "/buyer/post-requirement" },
    { icon: FileText, label: "My Requirements", href: "/buyer/requirements" },
    { icon: Users, label: "Proposals", href: "/buyer/proposals" },
  ],
  supplier: [
    { icon: Home, label: "Dashboard", href: "/supplier/dashboard" },
    { icon: Search, label: "Browse Requirements", href: "/supplier/browse" },
    { icon: FileText, label: "My Bids", href: "/supplier/bids" },
    { icon: Users, label: "My Riders", href: "/supplier/riders" },
  ],
  rider: [
    { icon: Home, label: "Dashboard", href: "/rider/dashboard" },
    { icon: Search, label: "Find Gigs", href: "/rider/gigs" },
    { icon: FileText, label: "My Applications", href: "/rider/applications" },
    { icon: User, label: "Profile", href: "/rider/profile" },
  ],
  admin: [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: FileText, label: "Requirements", href: "/admin/requirements" },
    { icon: Shield, label: "System", href: "/admin/system" },
  ],
}

const userTypeColors = {
  buyer: "from-blue-500 to-blue-600",
  supplier: "from-green-500 to-green-600",
  rider: "from-orange-500 to-orange-600",
  admin: "from-purple-500 to-purple-600",
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const currentUser = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    router.push("/")
  }

  const navItems = navigationItems[userType as keyof typeof navigationItems] || []
  const colorGradient = userTypeColors[userType as keyof typeof userTypeColors]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className={`flex items-center justify-between h-16 px-6 bg-gradient-to-r ${colorGradient}`}>
          <h1 className="text-xl font-bold text-white">FleetConnect</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = typeof window !== "undefined" && window.location.pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 h-12 ${
                  isActive
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">{userType} Dashboard</h2>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.company || currentUser?.location}</p>
              </div>
              <div
                className={`w-10 h-10 bg-gradient-to-r ${colorGradient} rounded-full flex items-center justify-center shadow-lg`}
              >
                <span className="text-white text-sm font-medium">{currentUser?.name?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
