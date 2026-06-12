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
        // Backend returns response.data.data.dashboard
        const data = unwrap(response)
        const dashboardData = data.dashboard || data

        this.totals = {
          totalCourses: numberFrom(dashboardData.courses_count, dashboardData.coursesCount, dashboardData.courses),
          totalStudents: numberFrom(dashboardData.students_count, dashboardData.studentsCount, dashboardData.students),
          totalLessons: numberFrom(dashboardData.lessons_count, dashboardData.lessonsCount, dashboardData.lessons),
          totalQuizzes: numberFrom(dashboardData.quizzes_count, dashboardData.quizzesCount, dashboardData.quizzes)
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
