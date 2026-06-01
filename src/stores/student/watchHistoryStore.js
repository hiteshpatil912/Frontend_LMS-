import { defineStore } from 'pinia'
import api from '@/plugins/axios'

const buildInitialHistory = () => []

const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useStudentWatchHistoryStore = defineStore('studentWatchHistory', {
  state: () => ({
    watchHistory: [],
    loading: false,
    saving: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.watchHistory,
    recentLessons: (state) =>
    [...(state.watchHistory || [])].sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)).slice(0, 6),
    historyForCourse: (state) => (courseId) => state.watchHistory.filter((item) => String(item.courseId) === String(courseId))
  },
  actions: {
    async fetchWatchHistory() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/watch-history')
        this.watchHistory = data.watch_history || []
      } catch (error) {
        this.errors = { general: 'Unable to sync watch history. Showing local activity.' }
      } finally {
        this.loading = false
      }
    },
    async updateLastWatched(payload) {
      this.saving = true
      this.errors = {}
      const entry = {
        id: `${payload.courseId}-${payload.lessonId}`,
        courseId: payload.courseId,
        courseTitle: payload.courseTitle,
        lessonId: payload.lessonId,
        lessonTitle: payload.lessonTitle,
        watchedDuration: payload.watchedDuration || payload.duration || '0 min',
        progress: payload.progress || 0,
        completed: Boolean(payload.completed),
        lastWatchedAt: new Date().toISOString()
      }

      try {
        await api.post('/student/watch-history', entry)
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to update watch history.' }
          throw error
        }
      } finally {
        this.watchHistory = [entry, ...this.watchHistory.filter((item) => item.id !== entry.id)]
        this.saving = false
      }
    }
  }
})
