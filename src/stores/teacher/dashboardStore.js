import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useTeacherDashboardStore = defineStore('teacherDashboard', {
  state: () => ({
    metrics: [
      { label: 'Published courses', value: 12, trend: '+2 this month' },
      { label: 'Active students', value: 3840, trend: '+9.8%' },
      { label: 'Assignments due', value: 28, trend: '-6.1%', tone: 'negative' },
      { label: 'Earnings', value: '$18.2k', trend: '+14.7%' }
    ],
    cohorts: [
      { id: 1, name: 'Product Leadership', progress: '82%', students: 420 },
      { id: 2, name: 'Design Systems', progress: '68%', students: 315 },
      { id: 3, name: 'Data Storytelling', progress: '74%', students: 268 }
    ],
    loading: false,
    error: null
  }),
  getters: {
    activeCohorts: (state) => state.cohorts.length,
    totalStudents: (state) => state.metrics.find((item) => item.label === 'Active students')?.value
  },
  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/teacher/dashboard')
        Object.assign(this, data.data || data)
      } catch (error) {
        this.error = error.response?.data?.message || error.message
      } finally {
        this.loading = false
      }
    }
  }
})
