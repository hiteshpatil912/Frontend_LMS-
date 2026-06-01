import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useNotificationStore } from '@/stores/shared/notificationStore'

const mockAnnouncements = [
  { id: 1, audience: 'all', course: 'All courses', title: 'Spring cohort orientation', message: 'Live orientation and office hours are scheduled for this week.', emailEnabled: true, createdAt: '2026-05-17', senderRole: 'admin' },
  { id: 2, audience: 'course', course: 'UX Research Systems', title: 'Research critique session', message: 'Bring your interview guide draft to the critique session.', emailEnabled: false, createdAt: '2026-05-18', senderRole: 'teacher' }
]

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useAnnouncementStore = defineStore('announcements', {
  state: () => ({
    announcements: [...mockAnnouncements],
    loading: false,
    saving: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.announcements,
    globalAnnouncements: (state) => state.announcements.filter((item) => item.audience === 'all'),
    courseAnnouncements: (state) => state.announcements.filter((item) => item.audience === 'course')
  },
  actions: {
    async fetchAnnouncements(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/announcements', { params })
        this.announcements = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync announcements. Showing local announcements.' }
      } finally {
        this.loading = false
      }
    },
    async createAnnouncement(payload) {
      this.saving = true
      this.errors = {}
      const notificationStore = useNotificationStore()
      try {
        const { data } = await api.post('/announcements', payload)
        const announcement = normalize(data)
        this.announcements.unshift(announcement)
        return announcement
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = error.response?.data?.errors || { general: error.response?.data?.message || 'Unable to create announcement.' }
          throw error
        }
        const announcement = { ...payload, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10) }
        this.announcements.unshift(announcement)
        notificationStore.pushNotification({
          type: payload.audience === 'course' ? 'course' : 'system',
          title: payload.title,
          message: payload.message
        })
        return announcement
      } finally {
        this.saving = false
      }
    }
  }
})
