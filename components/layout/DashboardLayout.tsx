"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NotificationDropdown } from "@/components/ui/notification-dropdown"
import { LogoutConfirmation } from "@/components/ui/logout-confirmation"
import { useNotifications } from "@/hooks/useNotifications"
import type { UserType } from "@/lib/types"
import { Home, Plus, FileText, Users, LogOut, Menu, X, Search, User, Shield } from "lucide-react"

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



export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const router = useRouter()
  const currentUser = authService.getCurrentUser()
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications()

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogoutConfirm = () => {
    authService.logout()
    router.push("/")
    setShowLogoutConfirmation(false)
  }

  const navItems = navigationItems[userType as keyof typeof navigationItems] || []

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex-shrink-0 border-r border-border
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className={`flex items-center justify-between h-16 px-6 bg-primary`}>
          <h1 className="text-xl font-bold text-primary-foreground">FleetConnect</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground hover:bg-primary-foreground/20"
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
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogoutClick}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full">
        {/* Top header */}
        <header className="bg-card shadow-sm border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {/* Hide dashboard text on mobile (below 768px), show abbreviated version on tablet, full on desktop */}
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground capitalize hidden sm:block">
              <span className="sm:hidden lg:inline">{userType} Dashboard</span>
              <span className="hidden sm:inline lg:hidden">{userType}</span>
              <span className="hidden lg:inline"> Dashboard</span>
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />

            <NotificationDropdown
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onClearAll={clearAll}
            />

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Hide user details on mobile, show only avatar */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.company || currentUser?.location}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground text-xs sm:text-sm font-medium">{currentUser?.name?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        open={showLogoutConfirmation}
        onOpenChange={setShowLogoutConfirmation}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  )
}
