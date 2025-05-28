'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { UserType } from '@/lib/types'
import { 
  Home, 
  Plus, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Truck,
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
  admin: [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: FileText, label: 'Requirements', href: '/admin/requirements' },
    { icon: Truck, label: 'Fleet Analytics', href: '/admin/analytics' },
  ],
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state, logout } = useApp()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navItems = navigationItems[userType] || []

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(var(--card))] shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-[hsl(var(--border))]">
          <h1 className="text-xl font-bold text-[hsl(var(--primary))]">FleetConnect</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-[hsl(var(--primary))]" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start mb-1 h-12 text-[hsl(var(--primary))]"
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
              >
                <Icon className="mr-3 h-5 w-5 text-[hsl(var(--primary))]" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[hsl(var(--border))]">
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
        <header className="bg-[hsl(var(--card))] shadow-sm border-b border-[hsl(var(--border))] h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2 text-[hsl(var(--primary))]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-[hsl(var(--primary))]" />
            </Button>
            <h2 className="text-lg font-semibold text-[hsl(var(--primary))] capitalize">
              {userType} Dashboard
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-[hsl(var(--primary))]">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-[hsl(var(--primary))]">
                  {state.currentUser?.name}
                </p>
                <p className="text-xs text-[hsl(var(--secondary-foreground))]">
                  {state.currentUser?.company || state.currentUser?.location}
                </p>
              </div>
              <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center">
                <span className="text-[hsl(var(--primary-foreground))] text-sm font-medium">
                  {state.currentUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
