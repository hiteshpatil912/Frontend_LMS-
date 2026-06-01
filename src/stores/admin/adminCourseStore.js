import { defineStore } from 'pinia'
import { adminCourseService } from '@/services/adminCourseService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process admin courses.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to manage courses.',
    404: 'Course data was not found.',
    422: 'Please check the course fields.',
    500: 'The server could not process courses right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback,
    validation: error.response?.data?.errors || {}
  }
}

const normalizeCourse = (course) => ({
  id: course.id,
  title: course.title || course.name || 'Untitled Course',
  instructor: course.instructor?.name || course.teacher?.name || course.instructor_name || course.teacher_name || 'Unassigned',
  status: course.status || 'pending'
})

export const useAdminPanelCourseStore = defineStore('adminPanelCourses', {
  state: () => ({
    courses: [],
    loading: false,
    savingId: null,
    deletingId: null,
    error: null
  }),

  getters: {
    hasCourses: (state) => state.courses.length > 0
  },

  actions: {
    clearError() {
      this.error = null
    },

    async fetchCourses(params = {}) {
      this.loading = true
      this.clearError()

      try {
        const response = await adminCourseService.getCourses(params)
        const payload = unwrap(response)
        const courses = Array.isArray(payload) ? payload : payload.courses || payload.data || []
        this.courses = courses.map(normalizeCourse)
        return this.courses
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load courses.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async approveCourse(id) {
      return this.updateCourseStatus(id, () => adminCourseService.approveCourse(id), 'Unable to approve course.')
    },

    async rejectCourse(id) {
      return this.updateCourseStatus(id, () => adminCourseService.rejectCourse(id), 'Unable to reject course.')
    },

    async deleteCourse(id) {
      this.deletingId = id
      this.clearError()

      try {
        await adminCourseService.deleteCourse(id)
        this.courses = this.courses.filter((course) => String(course.id) !== String(id))
      } catch (error) {
        this.error = normalizeError(error, 'Unable to delete course.')
        throw error
      } finally {
        this.deletingId = null
      }
    },

    async updateCourseStatus(id, request, fallback) {
      this.savingId = id
      this.clearError()

      try {
        const response = await request()
        const course = normalizeCourse(unwrap(response).course || unwrap(response))
        const index = this.courses.findIndex((item) => String(item.id) === String(id))

        if (index >= 0) {
          this.courses.splice(index, 1, course)
        }

        return course
      } catch (error) {
        this.error = normalizeError(error, fallback)
        throw error
      } finally {
        this.savingId = null
      }
    }
  }
})
