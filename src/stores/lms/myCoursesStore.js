import { defineStore } from 'pinia'
import { myCoursesService } from '@/services/myCoursesService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeCourse = (course) => {
  const source = course.course || course

  return {
    id: source.id || course.id,
    slug: source.slug || course.slug || source.id || course.id,
    title: source.title || source.name || 'Untitled Course',
    thumbnail: source.thumbnail || source.thumbnail_url || source.image || source.cover_image || null,
    progress: Number(course.progress_percentage ?? course.progress ?? source.progress_percentage ?? source.progress ?? 0),
    nextLessonId: course.next_lesson_id || course.nextLessonId || course.lesson_id || source.next_lesson_id || null,
    status: course.status || source.status || 'active'
  }
}

const normalizePagination = (payload) => {
  const meta = payload.meta || payload
  const links = payload.links || {}

  return {
    currentPage: Number(meta.current_page || meta.currentPage || 1),
    lastPage: Number(meta.last_page || meta.lastPage || 1),
    perPage: Number(meta.per_page || meta.perPage || 12),
    total: Number(meta.total || 0),
    nextPageUrl: links.next || meta.next_page_url || null,
    prevPageUrl: links.prev || meta.prev_page_url || null
  }
}

const normalizeError = (error) => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to view these courses.',
    404: 'No enrolled courses endpoint was found.',
    500: 'The server could not load your courses right now.'
  }

  return {
    status,
    message: messages[status] || message || 'Unable to load enrolled courses.'
  }
}

export const useLmsMyCoursesStore = defineStore('lmsMyCourses', {
  state: () => ({
    courses: [],
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 12,
      total: 0,
      nextPageUrl: null,
      prevPageUrl: null
    },
    loading: false,
    error: null
  }),

  getters: {
    hasCourses: (state) => state.courses.length > 0,
    hasPagination: (state) => state.pagination.lastPage > 1
  },

  actions: {
    async fetchCourses(page = 1) {
      this.loading = true
      this.error = null

      try {
        const response = await myCoursesService.getMyCourses({ page })
        const payload = unwrap(response)
        const items = Array.isArray(payload)
          ? payload
          : payload.data || payload.courses || payload.items || []

        this.courses = items.map(normalizeCourse)
        this.pagination = normalizePagination(Array.isArray(payload) ? {} : payload)
      } catch (error) {
        this.error = normalizeError(error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
