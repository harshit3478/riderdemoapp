"use client"

import * as React from "react"
import { Bell, Check, X, AlertCircle, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock formatDateTime function for demo
const formatDateTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
}

interface NotificationDropdownProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearAll: () => void
}

export function NotificationDropdown({ 
  notifications = [], 
  onMarkAsRead = () => {}, 
  onMarkAllAsRead = () => {}, 
  onClearAll = () => {} 
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': 
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-500/10'
        }
      case 'warning': 
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10'
        }
      case 'error': 
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/10'
        }
      default: 
        return {
          icon: Info,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10'
        }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-medium animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 bg-card border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">No notifications yet</p>
            <p className="text-muted-foreground/70 text-xs mt-1">We'll notify you when something happens</p>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification, index) => {
                const typeStyles = getTypeStyles(notification.type)
                const IconComponent = typeStyles.icon
                
                return (
                  <div
                    key={notification.id}
                    className={`relative border-b border-border/50 last:border-b-0 transition-all duration-200 hover:bg-muted/30 ${
                      !notification.read ? 'bg-accent/5' : ''
                    }`}
                  >
                    <div className="p-4 cursor-pointer" onClick={() => !notification.read && onMarkAsRead(notification.id)}>
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full ${typeStyles.bg} flex-shrink-0 mt-0.5`}>
                          <IconComponent className={`w-3.5 h-3.5 ${typeStyles.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium leading-tight ${
                              !notification.read ? 'text-foreground' : 'text-foreground/80'
                            }`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(notification.createdAt)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className={`text-sm mt-1 leading-relaxed ${
                            !notification.read ? 'text-muted-foreground' : 'text-muted-foreground/70'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onMarkAsRead(notification.id)
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-muted/50"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border bg-muted/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors h-8"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear all notifications
                </Button>
              </div>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Demo component to show the notification dropdown in action
export default function NotificationDemo() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to the platform!',
      message: 'Thank you for joining us. Get started by exploring the dashboard and setting up your profile.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: '2',
      title: 'System maintenance scheduled',
      message: 'We will be performing scheduled maintenance on Sunday at 2:00 AM UTC. The service may be unavailable for up to 30 minutes.',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: '3',
      title: 'Payment successful',
      message: 'Your subscription has been renewed successfully. Your next billing date is January 15, 2025.',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: '4',
      title: 'Security alert',
      message: 'We detected a new login from an unrecognized device. If this wasn\'t you, please secure your account immediately.',
      type: 'error',
      read: false,
      createdAt: new Date(Date.now() - 7200000) // 2 hours ago
    },
    {
      id: '5',
      title: 'New feature available',
      message: 'Check out our new dark mode theme and improved notification system. Update your preferences in settings.',
      type: 'info',
      read: true,
      createdAt: new Date(Date.now() - 172800000) // 2 days ago
    }
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-foreground mb-4">Notification System Demo</h1>
        <p className="text-muted-foreground mb-6">Click the notification bell to see the improved UI/UX</p>
        
        <div className="flex justify-center">
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {notifications.filter(n => !n.read).length} unread notifications
          </p>
        </div>
      </div>
    </div>
  )
}