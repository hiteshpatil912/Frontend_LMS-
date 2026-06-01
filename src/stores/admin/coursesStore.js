import { defineStore } from 'pinia'
import api from '@/plugins/axios'


export const mockCourses = [
  {
    id: 1,
    title: 'Product Strategy Masterclass',
    slug: 'product-strategy-masterclass',
    shortDescription: 'Enterprise product planning and experimentation.',
    fullDescription: 'A practical program for product leaders building strategy, discovery, and execution systems.',
    category: 'Business',
    thumbnail: '',
    instructor: 'Daniel Kim',
    price: 149,
    level: 'Advanced',
    duration: '8 weeks',
    createdAt: '2026-05-10',
    lessons: 42,
    students: 1260,
    status: 'published',
    description: 'Enterprise product planning and experimentation.'
  },
  {
    id: 2,
    title: 'UX Research Systems',
    slug: 'ux-research-systems',
    shortDescription: 'Research operations, interviews, and synthesis.',
    fullDescription: 'Design repeatable research workflows from planning through insight delivery.',
    category: 'Design',
    thumbnail: '',
    instructor: 'Mina Patel',
    price: 99,
    level: 'Intermediate',
    duration: '6 weeks',
    createdAt: '2026-05-12',
    lessons: 28,
    students: 840,
    status: 'draft',
    description: 'Research operations, interviews, and synthesis.'
  },
  {
    id: 3,
    title: 'Data Analytics for Teams',
    slug: 'data-analytics-for-teams',
    shortDescription: 'Dashboards, metrics, and decision workflows.',
    fullDescription: 'Learn practical analytics foundations for teams that need faster decisions.',
    category: 'Technology',
    thumbnail: '',
    instructor: 'Aisha Rahman',
    price: 79,
    level: 'Beginner',
    duration: '5 weeks',
    createdAt: '2026-05-15',
    lessons: 31,
    students: 1730,
    status: 'published',
    description: 'Dashboards, metrics, and decision workflows.'
  }
]

const normalize = (data) => data.data || data
const extractErrors = (error, fallback) => {
  if (error.response?.data?.errors) return error.response.data.errors
  return { general: error.response?.data?.message || fallback }
}
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useAdminCoursesStore = defineStore('adminCourses', {
  state: () => ({
    courses: mockCourses,
    currentCourse: null,
    loading: false,
    saving: false,
    deleting: false,
    publishing: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.courses,
    totalCourses: (state) => state.courses.length,
    publishedCourses: (state) => state.courses.filter((course) => course.status === 'published')
  },
  actions: {
    async fetchCourses(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/courses', { params })
        // this.courses = normalize(data)
        this.courses = data.courses || []
      } catch (error) {
        this.errors = { general: error.response?.data?.message || 'Unable to load courses. Showing local course defaults.' }
        this.courses = mockCourses
      } finally {
        this.loading = false
      }
    },
    async createCourse(payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.post('/courses', payload)
        const course = normalize(data)
        this.courses.unshift(course)
        return course
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to create course.')
          throw error
        }

        const course = {
          ...payload,
          id: Math.max(0, ...this.courses.map((item) => item.id)) + 1,
          createdAt: new Date().toISOString().slice(0, 10),
          lessons: 0,
          students: 0,
          description: payload.shortDescription
        }
        this.courses.unshift(course)
        return course
      } finally {
        this.saving = false
      }
    },
    async fetchSingleCourse(id) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/courses/${id}`)
        this.currentCourse = normalize(data)
      } catch (error) {
        this.currentCourse = this.courses.find((course) => String(course.id) === String(id)) || null
        if (!this.currentCourse) {
          this.errors = extractErrors(error, 'Course not found.')
        }
      } finally {
        this.loading = false
      }
    },
    async updateCourse(id, payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.put(`/courses/${id}`, payload)
        const course = normalize(data)
        const index = this.courses.findIndex((item) => String(item.id) === String(id))
        if (index >= 0) this.courses[index] = course
        this.currentCourse = course
        return course
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to update course.')
          throw error
        }

        const existing = this.courses.find((item) => String(item.id) === String(id))
        const course = { ...existing, ...payload, id: Number(id), description: payload.shortDescription }
        const index = this.courses.findIndex((item) => String(item.id) === String(id))
        if (index >= 0) this.courses[index] = course
        this.currentCourse = course
        return course
      } finally {
        this.saving = false
      }
    },
    async deleteCourse(id) {
      this.deleting = true
      this.errors = {}
      let shouldRemove = false
      try {
        await api.delete(`/courses/${id}`)
        shouldRemove = true
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to delete course.')
          throw error
        }
        shouldRemove = true
      } finally {
        if (shouldRemove) {
          this.courses = this.courses.filter((course) => String(course.id) !== String(id))
          if (String(this.currentCourse?.id) === String(id)) this.currentCourse = null
        }
        this.deleting = false
      }
    },
    async publishCourse(id, status) {
      this.publishing = true
      this.errors = {}
      try {
        const { data } = await api.patch(`/courses/${id}/publish`, { status })
        const course = normalize(data)
        const index = this.courses.findIndex((item) => String(item.id) === String(id))
        if (index >= 0) this.courses[index] = course
        this.currentCourse = course
        return course
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to update publish status.')
          throw error
        }
        return this.updateCourse(id, { ...this.currentCourse, status })
      } finally {
        this.publishing = false
      }
    }
  }
})
