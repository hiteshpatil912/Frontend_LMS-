import { defineStore } from 'pinia'
import { dashboardService } from '@/services/dashboardService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const numberFrom = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null)
  return Number(value || 0)
}

const listFrom = (...values) => {
  const value = values.find(Array.isArray)
  return value || []
}

const normalizeError = (error) => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to view the dashboard.',
    404: 'Dashboard data was not found.',
    500: 'The server could not load your dashboard right now.'
  }

  return {
    status,
    message: messages[status] || message || 'Unable to load dashboard data.'
  }
}

export const useLmsDashboardStore = defineStore('lmsDashboard', {
  state: () => ({
    totals: {
      enrolledCourses: 0,
      completedCourses: 0,
      activeCourses: 0,
      certificatesEarned: 0
    },
    recentNotifications: [],
    continueLearning: [],
    loading: false,
    error: null
  }),

  getters: {
    stats: (state) => [
      { label: 'Total Enrolled Courses', value: state.totals.enrolledCourses },
      { label: 'Completed Courses', value: state.totals.completedCourses },
      { label: 'Active Courses', value: state.totals.activeCourses },
      { label: 'Certificates Earned', value: state.totals.certificatesEarned }
    ]
  },

  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = null

      try {
        const response = await dashboardService.getStudentDashboard()
        const data = unwrap(response)
        const stats = data.stats || data.summary || data.totals || data

        this.totals = {
          enrolledCourses: numberFrom(stats.total_enrolled_courses, stats.enrolled_courses, stats.totalEnrolledCourses),
          completedCourses: numberFrom(stats.completed_courses, stats.completedCourses),
          activeCourses: numberFrom(stats.active_courses, stats.activeCourses),
          certificatesEarned: numberFrom(stats.certificates_earned, stats.certificatesEarned, stats.certificates)
        }

        this.recentNotifications = listFrom(
          data.recent_notifications,
          data.recentNotifications,
          data.notifications
        )

        this.continueLearning = listFrom(
          data.continue_learning,
          data.continueLearning,
          data.learning_plan,
          data.learningPlan
        )
      } catch (error) {
        this.error = normalizeError(error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
