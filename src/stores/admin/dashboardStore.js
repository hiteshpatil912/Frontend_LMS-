import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useAdminDashboardStore = defineStore('adminDashboard', {
  state: () => ({
    metrics: [
      { label: 'Total learners', value: '24.8k', trend: '+12.5%' },
      { label: 'Active courses', value: 186, trend: '+8.2%' },
      { label: 'Monthly revenue', value: '$92.4k', trend: '+18.1%' },
      { label: 'Completion rate', value: '76%', trend: '+4.4%' }
    ],
    activity: [
      { id: 1, user: 'Aisha Rahman', action: 'enrolled in Product Strategy', status: 'Active' },
      { id: 2, user: 'Daniel Kim', action: 'completed UX Research', status: 'Completed' },
      { id: 3, user: 'Mina Patel', action: 'requested certificate', status: 'Pending' }
    ],
    loading: false,
    error: null
  }),
  getters: {
    totalRevenue: (state) => state.metrics.find((item) => item.label === 'Monthly revenue')?.value,
    recentActivity: (state) => state.activity.slice(0, 5)
  },
  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/admin/dashboard')
        Object.assign(this, data.data || data)
      } catch (error) {
        this.error = error.response?.data?.message || error.message
      } finally {
        this.loading = false
      }
    }
  }
})
