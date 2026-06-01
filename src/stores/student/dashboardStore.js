import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useStudentDashboardStore = defineStore('studentDashboard', {
  state: () => ({
    metrics: [
      { label: 'Enrolled courses', value: 8, trend: '+1 this week' },
      { label: 'Lessons completed', value: 126, trend: '+18' },
      { label: 'Study streak', value: '14 days', trend: '+4 days' },
      { label: 'Certificates', value: 5, trend: '+1' }
    ],
    learningPlan: [
      { id: 1, title: 'Research Interview Practice', course: 'UX Research Systems', status: 'Today' },
      { id: 2, title: 'Metric Tree Workshop', course: 'Data Analytics', status: 'Tomorrow' },
      { id: 3, title: 'Final Project Review', course: 'Product Strategy', status: 'Friday' }
    ],
    loading: false,
    error: null
  }),
  getters: {
    nextLesson: (state) => state.learningPlan[0],
    totalEnrolled: (state) => state.metrics.find((item) => item.label === 'Enrolled courses')?.value
  },
  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/student/dashboard')
        Object.assign(this, data.data || data)
      } catch (error) {
        this.error = error.response?.data?.message || error.message
      } finally {
        this.loading = false
      }
    }
  }
})
