"use client"

import { useState, useEffect } from 'react'
import { notificationStore } from '@/lib/stores/notification-store'
import { Notification } from '@/components/ui/notification-dropdown'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Initial load
    setNotifications(notificationStore.getNotifications())
    setUnreadCount(notificationStore.getUnreadCount())

    // Subscribe to changes
    const unsubscribe = notificationStore.subscribe(() => {
      setNotifications(notificationStore.getNotifications())
      setUnreadCount(notificationStore.getUnreadCount())
    })

    return unsubscribe
  }, [])

  const markAsRead = (id: string) => {
    notificationStore.markAsRead(id)
  }

  const markAllAsRead = () => {
    notificationStore.markAllAsRead()
  }

  const clearAll = () => {
    notificationStore.clearAll()
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    notificationStore.addNotification(notification)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    addNotification
  }
}
