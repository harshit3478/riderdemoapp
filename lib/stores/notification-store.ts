import { Notification } from "@/components/ui/notification-dropdown"

class NotificationStore {
  private notifications: Notification[] = []
  private listeners: (() => void)[] = []

  constructor() {
    // Initialize with sample notifications
    this.notifications = [
      {
        id: '1',
        title: 'New Bid Received',
        message: 'FleetMaster Solutions submitted a bid for your delivery requirement "Food Delivery - Downtown"',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: '2',
        title: 'Requirement Confirmed',
        message: 'Your delivery requirement "Grocery Delivery - Suburbs" has been confirmed and assigned to RideExpress',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        id: '3',
        title: 'Delivery Completed',
        message: 'Your delivery requirement "Medicine Delivery - City Center" has been successfully completed',
        type: 'success',
        read: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        id: '4',
        title: 'Payment Reminder',
        message: 'Payment for completed delivery "Electronics Delivery - Tech Park" is due in 2 days',
        type: 'warning',
        read: false,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
      },
      {
        id: '5',
        title: 'Profile Update Required',
        message: 'Please update your company profile to include GST information for better service',
        type: 'info',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]
  }

  getNotifications(): Notification[] {
    return [...this.notifications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  clearAll(): void {
    this.notifications = []
    this.notifyListeners()
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }
}

export const notificationStore = new NotificationStore()
