import { defineStore } from 'pinia'
import { progressService } from '@/services/progressService'
import { useLmsCourseDetailsStore } from '@/stores/lms/courseDetailsStore'
import { useLmsDashboardStore } from '@/stores/lms/dashboardStore'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeProgress = (payload) => {
  const data = payload.progress || payload
  const completedLessons = data.completed_lessons || data.completedLessons || []
  const completedLessonIds = completedLessons.map((lesson) => lesson.id || lesson.lesson_id || lesson)

  return {
    percentage: Number(data.progress_percentage || data.percentage || data.progress || 0),
    completedLessons: Number(data.completed_lessons_count || data.completed_count || completedLessons.length || 0),
    totalLessons: Number(data.total_lessons || data.totalLessons || data.lessons_count || 0),
    completedLessonIds
  }
}

const normalizeError = (error, fallback) => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to update this progress.',
    404: 'Progress data was not found.',
    500: 'The server could not update progress right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback
  }
}

export const useLmsProgressStore = defineStore('lmsProgress', {
  state: () => ({
    byCourse: {},
    loading: false,
    completing: false,
    error: null
  }),

  getters: {
    forCourse: (state) => (courseId) =>
      state.byCourse[String(courseId)] || {
        percentage: 0,
        completedLessons: 0,
        totalLessons: 0,
        completedLessonIds: []
      }
  },

  actions: {
    async fetchProgress(courseId) {
      this.loading = true
      this.error = null

      try {
        const response = await progressService.getCourseProgress(courseId)
        const progress = normalizeProgress(unwrap(response))
        this.byCourse[String(courseId)] = progress

        const details = useLmsCourseDetailsStore()
        details.applyProgress(progress)

        return progress
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load course progress.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async completeLesson(courseId, lessonId) {
      this.completing = true
      this.error = null

      try {
        await progressService.completeLesson(lessonId)

        const details = useLmsCourseDetailsStore()
        details.markLessonComplete(lessonId)

        const progress = await this.fetchProgress(courseId)
        const dashboard = useLmsDashboardStore()

        if (dashboard.totals.enrolledCourses || dashboard.continueLearning.length) {
          dashboard.fetchDashboard().catch(() => {})
        }

        return progress
      } catch (error) {
        this.error = normalizeError(error, 'Unable to mark this lesson complete.')
        throw error
      } finally {
        this.completing = false
      }
    }
  }
})
