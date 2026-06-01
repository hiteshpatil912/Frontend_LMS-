import { defineStore } from 'pinia'
import api from '@/plugins/axios'

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useStudentEnrolledCourseStore = defineStore('studentEnrolledCourses', {
  state: () => ({
   enrolledCourses: [],
catalog: [],
    currentCourse: null,
    loading: false,
    enrolling: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.enrolledCourses,
    completedCourses: (state) => state.enrolledCourses.filter((course) => course.status === 'completed'),
    inProgressCourses: (state) => state.enrolledCourses.filter((course) => course.status === 'in_progress'),
    progressPercentage: () => (course) => {
      const lessons = course?.lessons || []
      if (!lessons.length) return 0
      return Math.round((lessons.filter((lesson) => lesson.completed).length / lessons.length) * 100)
    },
    isEnrolled: (state) => (courseId) => state.enrolledCourses.some((course) => String(course.id) === String(courseId))
  },
  actions: {
    async fetchEnrolledCourses() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/enrolled-courses')
this.enrolledCourses = data.courses || []
      } catch (error) {
        this.errors = { general: error.response?.data?.message || 'Unable to sync enrollments. Showing local learning data.' }
      } finally {
        this.loading = false
      }
    },
    async enrollCourse(courseId) {
      this.enrolling = true
      this.errors = {}
      try {
const { data } = await api.post(`/courses/${courseId}/enroll`)
        const course = normalize(data)
        if (!this.isEnrolled(course.id)) this.enrolledCourses.unshift(course)
        return course
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to enroll in course.' }
          throw error
        }
        const course = this.catalog.find((item) => String(item.id) === String(courseId))
        if (course && !this.isEnrolled(course.id)) {
          const enrolled = { ...course, status: 'in_progress' }
          this.enrolledCourses.unshift(enrolled)
          return enrolled
        }
        return course
      } finally {
        this.enrolling = false
      }
    },
   async fetchCourse(id) {

  this.loading = true

  this.errors = {}

  try {

    const { data } = await api.get(`/courses/${id}`)

    this.currentCourse = data.course || null

  } catch (error) {

    console.error(error)

    this.errors = {
      general: 'Unable to fetch course'
    }

  } finally {

    this.loading = false

  }

},
    updateLessonState(courseId, lessonId, patch) {
      const update = (course) => {
        if (!course || String(course.id) !== String(courseId)) return course
        const lessons = course.lessons.map((lesson) => (String(lesson.id) === String(lessonId) ? { ...lesson, ...patch } : lesson))
        const completed = lessons.every((lesson) => lesson.completed)
        return { ...course, lessons, status: completed ? 'completed' : 'in_progress' }
      }
      this.enrolledCourses = this.enrolledCourses.map(update)
      this.catalog = this.catalog.map(update)
      this.currentCourse = update(this.currentCourse)
    }
  }
})
