import { defineStore } from 'pinia'
import { teacherCourseService } from '@/services/teacherCourseService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process teacher courses.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to manage teacher courses.',
    404: 'Teacher course data was not found.',
    422: 'Please check the course form fields.',
    500: 'The server could not process teacher courses right now.'
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
  description: course.description || '',
  price: Number(course.price || 0),
  thumbnail: course.thumbnail || course.thumbnail_url || course.image || course.cover_image || null,
  status: course.status || 'draft',
  lessonsCount: Number(course.lessons_count || course.total_lessons || course.lessonsCount || 0),
  studentsCount: Number(course.students_count || course.total_students || course.studentsCount || 0),
  createdAt: course.created_at || course.createdAt || null
})

export const useTeacherPanelCourseStore = defineStore('teacherPanelCourses', {
  state: () => ({
    courses: [],
    loading: false,
    saving: false,
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
        const response = await teacherCourseService.getCourses(params)
        const payload = unwrap(response)
        const courses = Array.isArray(payload) ? payload : payload.courses || payload.data || []
        this.courses = courses.map(normalizeCourse)
        return this.courses
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load teacher courses.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCourse(payload) {
      this.saving = true
      this.clearError()

      try {
        const response = await teacherCourseService.createCourse(payload)
        const course = normalizeCourse(unwrap(response).course || unwrap(response))
        this.courses.unshift(course)
        return course
      } catch (error) {
        this.error = normalizeError(error, 'Unable to create course.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async updateCourse(id, payload) {
      this.saving = true
      this.clearError()

      try {
        const response = await teacherCourseService.updateCourse(id, payload)
        const course = normalizeCourse(unwrap(response).course || unwrap(response))
        const index = this.courses.findIndex((item) => String(item.id) === String(id))

        if (index >= 0) {
          this.courses.splice(index, 1, course)
        }

        return course
      } catch (error) {
        this.error = normalizeError(error, 'Unable to update course.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async deleteCourse(id) {
      this.deletingId = id
      this.clearError()

      try {
        await teacherCourseService.deleteCourse(id)
        this.courses = this.courses.filter((course) => String(course.id) !== String(id))
      } catch (error) {
        this.error = normalizeError(error, 'Unable to delete course.')
        throw error
      } finally {
        this.deletingId = null
      }
    }
  }
})
