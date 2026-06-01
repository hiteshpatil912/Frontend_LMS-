import { defineStore } from 'pinia'
import { teacherAnalyticsService } from '@/services/teacherAnalyticsService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const numberFrom = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null)
  return Number(value || 0)
}

const normalizeError = (error, fallback = 'Unable to load analytics.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to view analytics.',
    404: 'Analytics data was not found.',
    500: 'The server could not load analytics right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback
  }
}

const normalizeDashboardAnalytics = (payload) => {
  const data = payload.analytics || payload.stats || payload.summary || payload

  return {
    totalStudents: numberFrom(data.total_students, data.totalStudents, data.students),
    totalEnrollments: numberFrom(data.total_enrollments, data.totalEnrollments, data.enrollments),
    completedCourses: numberFrom(data.completed_courses, data.completedCourses),
    averageQuizScore: numberFrom(data.average_quiz_score, data.averageQuizScore, data.avg_quiz_score),
    averageCourseRating: numberFrom(data.average_course_rating, data.averageCourseRating, data.avg_rating)
  }
}

const normalizeCourseAnalytics = (payload) => {
  const data = payload.analytics || payload
  const course = data.course || payload.course || {}

  return {
    courseId: data.course_id || course.id,
    courseTitle: data.course_title || course.title || course.name || 'Course',
    studentsEnrolled: numberFrom(data.students_enrolled, data.studentsEnrolled, data.enrollments),
    completionPercentage: numberFrom(data.completion_percentage, data.completionPercentage, data.completion_rate),
    quizAttempts: numberFrom(data.quiz_attempts, data.quizAttempts),
    averageRating: numberFrom(data.average_rating, data.averageRating, data.avg_rating)
  }
}

export const useTeacherPanelAnalyticsStore = defineStore('teacherPanelAnalytics', {
  state: () => ({
    analytics: {
      totalStudents: 0,
      totalEnrollments: 0,
      completedCourses: 0,
      averageQuizScore: 0,
      averageCourseRating: 0
    },
    courseAnalytics: [],
    loading: false,
    courseLoading: false,
    error: null
  }),

  getters: {
    chartBars: (state) => [
      { label: 'Students', value: Math.min(100, state.analytics.totalStudents) },
      { label: 'Enroll', value: Math.min(100, state.analytics.totalEnrollments) },
      { label: 'Done', value: Math.min(100, state.analytics.completedCourses) },
      { label: 'Quiz', value: Math.min(100, state.analytics.averageQuizScore) },
      { label: 'Rating', value: Math.min(100, state.analytics.averageCourseRating * 20) }
    ]
  },

  actions: {
    clearError() {
      this.error = null
    },

    async fetchDashboardAnalytics() {
      this.loading = true
      this.clearError()

      try {
        const response = await teacherAnalyticsService.getDashboardAnalytics()
        this.analytics = normalizeDashboardAnalytics(unwrap(response))
        return this.analytics
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load dashboard analytics.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourseAnalytics(courseId) {
      this.courseLoading = true
      this.clearError()

      try {
        const response = await teacherAnalyticsService.getCourseAnalytics(courseId)
        const analytics = normalizeCourseAnalytics(unwrap(response))
        const existingIndex = this.courseAnalytics.findIndex((item) => String(item.courseId) === String(courseId))

        if (existingIndex >= 0) {
          this.courseAnalytics.splice(existingIndex, 1, analytics)
        } else {
          this.courseAnalytics.push(analytics)
        }

        return analytics
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load course analytics.')
        throw error
      } finally {
        this.courseLoading = false
      }
    }
  }
})
