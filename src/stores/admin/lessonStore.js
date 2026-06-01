import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const mockLessons = [
  {
    id: 1,
    courseId: 1,
    courseName: 'Product Strategy Masterclass',
    title: 'Strategy Foundations',
    slug: 'strategy-foundations',
    description: 'Set the operating context for product strategy work.',
    videoUrl: 'https://storage.example.com/videos/strategy-foundations.mp4',
    videoPreview: '',
    duration: '18 min',
    order: 1,
    status: 'published'
  },
  {
    id: 2,
    courseId: 1,
    courseName: 'Product Strategy Masterclass',
    title: 'Opportunity Mapping',
    slug: 'opportunity-mapping',
    description: 'Map customer and market signals into strategic bets.',
    videoUrl: '',
    videoPreview: '',
    duration: '26 min',
    order: 2,
    status: 'draft'
  },
  {
    id: 3,
    courseId: 2,
    courseName: 'UX Research Systems',
    title: 'Research Intake',
    slug: 'research-intake',
    description: 'Create a repeatable intake process for research requests.',
    videoUrl: '',
    videoPreview: '',
    duration: '21 min',
    order: 1,
    status: 'published'
  }
]

const normalize = (data) => data.data || data
const extractErrors = (error, fallback) => {
  if (error.response?.data?.errors) return error.response.data.errors
  return { general: error.response?.data?.message || fallback }
}
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useAdminLessonStore = defineStore('adminLessons', {
  state: () => ({
    lessons: mockLessons,
    currentLesson: null,
    loading: false,
    saving: false,
    errors: {}
  }),
  getters: {
    totalLessons: (state) => state.lessons.length,
    lessonsByCourse: (state) => (courseId) =>
      state.lessons
        .filter((lesson) => String(lesson.courseId) === String(courseId))
        .sort((a, b) => Number(a.order) - Number(b.order))
  },
  actions: {
    async fetchLessons(courseId) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/admin/courses/${courseId}/lessons`)
        this.lessons = normalize(data)
      } catch (error) {
        this.errors = { general: error.response?.data?.message || 'Unable to load lessons. Showing local lesson defaults.' }
        this.lessons = mockLessons
      } finally {
        this.loading = false
      }
    },
    async createLesson(courseId, payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.post(`/admin/courses/${courseId}/lessons`, payload)
        const lesson = normalize(data)
        this.lessons.unshift(lesson)
        return lesson
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to create lesson.')
          throw error
        }

        const lesson = {
          ...payload,
          id: Math.max(0, ...this.lessons.map((item) => item.id)) + 1,
          courseId: Number(courseId)
        }
        this.lessons.unshift(lesson)
        return lesson
      } finally {
        this.saving = false
      }
    },
    async fetchSingleLesson(id) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/admin/lessons/${id}`)
        this.currentLesson = normalize(data)
      } catch (error) {
        this.currentLesson = this.lessons.find((lesson) => String(lesson.id) === String(id)) || null
        if (!this.currentLesson) this.errors = extractErrors(error, 'Lesson not found.')
      } finally {
        this.loading = false
      }
    }
  }
})
