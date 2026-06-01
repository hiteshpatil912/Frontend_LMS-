import { defineStore } from 'pinia'
import { teacherDashboardService } from '@/services/teacherDashboardService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const numberFrom = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null)
  return Number(value || 0)
}

const normalizeError = (error, fallback = 'Unable to load teacher dashboard.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to access the teacher dashboard.',
    404: 'Teacher dashboard data was not found.',
    500: 'The server could not load the teacher dashboard right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback
  }
}

export const useTeacherPanelDashboardStore = defineStore('teacherPanelDashboard', {
  state: () => ({
    totals: {
      totalCourses: 0,
      totalStudents: 0,
      totalLessons: 0,
      totalQuizzes: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    metrics: (state) => [
      { label: 'Total Courses', value: state.totals.totalCourses },
      { label: 'Total Students', value: state.totals.totalStudents },
      { label: 'Total Lessons', value: state.totals.totalLessons },
      { label: 'Total Quizzes', value: state.totals.totalQuizzes }
    ]
  },

  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = null

      try {
        const response = await teacherDashboardService.getDashboard()
        const data = unwrap(response)
        const stats = data.stats || data.summary || data.totals || data

        this.totals = {
          totalCourses: numberFrom(stats.total_courses, stats.totalCourses, stats.courses),
          totalStudents: numberFrom(stats.total_students, stats.totalStudents, stats.students),
          totalLessons: numberFrom(stats.total_lessons, stats.totalLessons, stats.lessons),
          totalQuizzes: numberFrom(stats.total_quizzes, stats.totalQuizzes, stats.quizzes)
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
