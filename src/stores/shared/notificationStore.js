import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const notificationTypes = [
  'system',
  'course',
  'quiz',
  'enrollment',
  'certificate',
  'assignment'
]

const mockNotifications = [
  {
    id: 1,
    type: 'system',
    title: 'Platform maintenance',
    message: 'The LMS will receive a performance update tonight.',
    timestamp: '2026-05-19T09:20:00.000Z',
    is_read: false
  },
  {
    id: 2,
    type: 'course',
    title: 'New lesson published',
    message: 'UX Research Systems has a new synthesis lesson available.',
    timestamp: '2026-05-19T08:10:00.000Z',
    is_read: false,
    courseId: 1
  },
  {
    id: 3,
    type: 'quiz',
    title: 'Quiz reminder',
    message: 'Complete your analytics quiz before the weekly checkpoint.',
    timestamp: '2026-05-18T16:30:00.000Z',
    is_read: true
  },
  {
    id: 4,
    type: 'certificate',
    title: 'Certificate ready',
    message: 'Your Product Strategy certificate is ready to download.',
    timestamp: '2026-05-18T12:45:00.000Z',
    is_read: false
  },
  {
    id: 5,
    type: 'assignment',
    title: 'Assignment due soon',
    message: 'Interview planning submission closes tomorrow.',
    timestamp: '2026-05-17T14:00:00.000Z',
    is_read: true
  }
]

const shouldUseLocalFallback = (error) =>
  !error.response || [404, 405].includes(error.response.status)

export const useNotificationStore = defineStore('notifications', {

  state: () => ({

    notifications: [...mockNotifications],

    toastQueue: [],

    loading: false,

    errors: {}

  }),

  getters: {

    unreadCount: (state) =>
      Array.isArray(state.notifications)
        ? state.notifications.filter(
            (item) => !item.is_read
          ).length
        : 0,

    recentNotifications: (state) =>
      Array.isArray(state.notifications)
        ? [...state.notifications]
            .sort(
              (a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            )
            .slice(0, 6)
        : [],

    notificationsByType: (state) => (type) =>
      Array.isArray(state.notifications)
        ? state.notifications.filter(
            (item) => item.type === type
          )
        : []

  },

  actions: {

    async fetchNotifications() {

      this.loading = true

      this.errors = {}

      try {

        const { data } = await api.get('/my-notifications')

        this.notifications = data.notifications || []

      } catch (error) {

        console.error(error)

        this.errors = {
          general:
            'Unable to sync notifications. Showing local notifications.'
        }

      } finally {

        this.loading = false

      }

    },

    async markAsRead(id) {

      try {

        await api.put(`/notifications/${id}/read`)

      } catch (error) {

        if (!shouldUseLocalFallback(error)) {

          this.errors = {
            general:
              error.response?.data?.message ||
              'Unable to mark notification as read.'
          }

          throw error

        }

      } finally {

        this.notifications = this.notifications.map((item) =>
          String(item.id) === String(id)
            ? { ...item, is_read: true }
            : item
        )

      }

    },

    async markAllAsRead() {

      this.notifications = this.notifications.map((item) => ({
        ...item,
        is_read: true
      }))

    },

    pushNotification(payload) {

      const notification = {

        id: Date.now(),

        type: payload.type || 'system',

        title: payload.title,

        message: payload.message,

        timestamp: new Date().toISOString(),

        is_read: false

      }

      this.notifications.unshift(notification)

      this.toastQueue.unshift(notification)

      return notification

    },

    dismissToast(id) {

      this.toastQueue = this.toastQueue.filter(
        (item) => String(item.id) !== String(id)
      )

    }

  }

})