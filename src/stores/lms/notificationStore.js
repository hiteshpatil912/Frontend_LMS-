import { defineStore } from 'pinia'
import { notificationService } from '@/services/notificationService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process notifications.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to access notifications.',
    404: 'Notifications were not found.',
    500: 'The server could not load notifications right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback
  }
}

const isUnread = (notification) => {
  if (notification.read_at) return false
  if (notification.is_read !== undefined) return !notification.is_read
  if (notification.read !== undefined) return !notification.read
  return true
}

const normalizeNotification = (notification) => ({
  id: notification.id,
  title: notification.title || notification.data?.title || notification.type || 'Notification',
  message: notification.message || notification.body || notification.data?.message || notification.data?.body || '',
  read: !isUnread(notification),
  createdDate: notification.created_at || notification.timestamp || notification.createdDate || null
})

export const useLmsNotificationStore = defineStore('lmsNotifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    markingId: null,
    error: null
  }),

  getters: {
    recentNotifications: (state) => state.notifications.slice(0, 6),
    hasNotifications: (state) => state.notifications.length > 0
  },

  actions: {
    clearError() {
      this.error = null
    },

    syncUnreadCount() {
      this.unreadCount = this.notifications.filter((item) => !item.read).length
    },

    async fetchNotifications() {
      this.loading = true
      this.clearError()

      try {
        const response = await notificationService.getNotifications()
        const payload = unwrap(response)
        const notifications = Array.isArray(payload)
          ? payload
          : payload.notifications || payload.data || []

        this.notifications = notifications.map(normalizeNotification)
        this.unreadCount = Number(payload.unread_count ?? payload.unreadCount ?? this.notifications.filter((item) => !item.read).length)
        return this.notifications
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load notifications.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAsRead(id) {
      this.markingId = id
      this.clearError()

      try {
        await notificationService.markAsRead(id)
        this.notifications = this.notifications.map((notification) =>
          String(notification.id) === String(id)
            ? { ...notification, read: true }
            : notification
        )
        this.syncUnreadCount()
      } catch (error) {
        this.error = normalizeError(error, 'Unable to mark notification as read.')
        throw error
      } finally {
        this.markingId = null
      }
    }
  }
})
