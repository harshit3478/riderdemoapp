'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UserType } from '@/lib/types'
import {
  Home,
  Plus,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: UserType
}

const navigationItems = {
  buyer: [
    { icon: Home, label: 'Dashboard', href: '/buyer/dashboard' },
    { icon: Plus, label: 'Post Requirement', href: '/buyer/post-requirement' },
    { icon: FileText, label: 'My Requirements', href: '/buyer/requirements' },
    { icon: Users, label: 'Proposals', href: '/buyer/proposals' },
  ],
  supplier: [
    { icon: Home, label: 'Dashboard', href: '/supplier/dashboard' },
    { icon: Search, label: 'Browse Requirements', href: '/supplier/browse' },
    { icon: FileText, label: 'My Bids', href: '/supplier/bids' },
    { icon: Users, label: 'My Riders', href: '/supplier/riders' },
  ],
  rider: [
    { icon: Home, label: 'Dashboard', href: '/rider/dashboard' },
    { icon: Search, label: 'Find Gigs', href: '/rider/gigs' },
    { icon: FileText, label: 'My Applications', href: '/rider/applications' },
    { icon: User, label: 'Profile', href: '/rider/profile' },
  ],
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const currentUser = auth.getCurrentUser()

  const handleLogout = () => {
    auth.logout()
    router.push('/')
  }

  const navItems = navigationItems[userType as keyof typeof navigationItems] || []

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          {/* TODO: Replace with FleetConnect logo from Figma */}
          <h1 className="text-xl font-bold text-primary">FleetConnect</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start mb-1 h-12 text-foreground hover:bg-accent hover:text-accent-foreground"
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
        <header className="bg-card shadow-sm border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground capitalize">
              {userType} Dashboard
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.company || currentUser?.location}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
