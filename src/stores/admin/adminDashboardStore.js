import { defineStore } from 'pinia'
import { adminDashboardService } from '@/services/adminDashboardService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const numberFrom = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null)
  return Number(value || 0)
}

const normalizeError = (error, fallback = 'Unable to load admin dashboard.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to access the admin dashboard.',
    404: 'Admin dashboard data was not found.',
    500: 'The server could not load the admin dashboard right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback
  }
}

export const useAdminPanelDashboardStore = defineStore('adminPanelDashboard', {
  state: () => ({
    totals: {
      totalUsers: 0,
      totalStudents: 0,
      totalTeachers: 0,
      totalCourses: 0,
      totalRevenue: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    metrics: (state) => [
      { label: 'Total Users', value: state.totals.totalUsers },
      { label: 'Total Students', value: state.totals.totalStudents },
      { label: 'Total Teachers', value: state.totals.totalTeachers },
      { label: 'Total Courses', value: state.totals.totalCourses },
      { label: 'Total Revenue', value: `$${Number(state.totals.totalRevenue || 0).toLocaleString()}` }
    ]
  },

  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = null

      try {
        const response = await adminDashboardService.getDashboard()
        const data = unwrap(response)
        const stats = data.stats || data.summary || data.totals || data

        this.totals = {
          totalUsers: numberFrom(stats.total_users, stats.totalUsers, stats.users),
          totalStudents: numberFrom(stats.total_students, stats.totalStudents, stats.students),
          totalTeachers: numberFrom(stats.total_teachers, stats.totalTeachers, stats.teachers),
          totalCourses: numberFrom(stats.total_courses, stats.totalCourses, stats.courses),
          totalRevenue: numberFrom(stats.total_revenue, stats.totalRevenue, stats.revenue)
        }
      } catch (error) {
        this.error = normalizeError(error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
