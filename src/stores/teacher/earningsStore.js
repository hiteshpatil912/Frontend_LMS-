import { defineStore } from 'pinia'
import api from '@/plugins/axios'

const mockEarnings = [
  { id: 1, month: 'May 2026', course: 'UX Research Systems', gross: 18240, payout: 15960, students: 184, status: 'processing' },
  { id: 2, month: 'April 2026', course: 'Product Strategy Masterclass', gross: 16880, payout: 14720, students: 132, status: 'paid' },
  { id: 3, month: 'March 2026', course: 'Data Analytics for Teams', gross: 14310, payout: 12480, students: 119, status: 'paid' }
]

const normalize = (data) => data.data || data

export const useTeacherEarningsStore = defineStore('teacherEarnings', {
  state: () => ({
    earnings: [...mockEarnings],
    loading: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.earnings,
    totalEarnings: (state) => state.earnings.reduce((sum, item) => sum + item.gross, 0),
    monthlyEarnings: (state) => state.earnings[0]?.gross || 0,
    totalPayouts: (state) => state.earnings.reduce((sum, item) => sum + item.payout, 0),
    enrolledStudentsRevenue: (state) => state.earnings.reduce((sum, item) => sum + item.students, 0)
  },
  actions: {
    async fetchEarnings(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/teacher/earnings', { params })
        this.earnings = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync earnings. Showing local earnings data.' }
      } finally {
        this.loading = false
      }
    }
  }
})
