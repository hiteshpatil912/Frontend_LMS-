import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useStudentEnrolledCourseStore } from '@/stores/student/enrolledCourseStore'
import { useStudentWatchHistoryStore } from '@/stores/student/watchHistoryStore'

const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

const buildContinueCourses = () => {
  const enrollmentStore = useStudentEnrolledCourseStore()
  const historyStore = useStudentWatchHistoryStore()

  return enrollmentStore.inProgressCourses.map((course) => {
    const latestHistory = historyStore.historyForCourse(course.id).sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt))[0]
    const fallbackLesson = course.lessons.find((lesson) => !lesson.completed) || course.lessons[0]
    const lastLesson = latestHistory
      ? course.lessons.find((lesson) => String(lesson.id) === String(latestHistory.lessonId)) || fallbackLesson
      : fallbackLesson

    const completedLessons = course.lessons.filter((lesson) => lesson.completed).length
    const progress = course.lessons.length ? Math.round((completedLessons / course.lessons.length) * 100) : 0

    return {
      id: course.id,
      course,
      courseTitle: course.title,
      lesson: lastLesson,
      lessonId: lastLesson?.id,
      lessonTitle: lastLesson?.title || 'Course complete',
      watchedDuration: latestHistory?.watchedDuration || lastLesson?.duration || '0 min',
      progress: latestHistory?.progress || progress,
      courseProgress: progress,
      completed: progress === 100,
      lastWatchedAt: latestHistory?.lastWatchedAt || new Date().toISOString()
    }
  })
}

export const useStudentContinueLearningStore = defineStore('studentContinueLearning', {
  state: () => ({
    continueCourses: [],
    loading: false,
    saving: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.continueCourses,
    recentlyWatched: (state) =>
      [...state.continueCourses].sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)),
    completedCourses: (state) => (state.continueCourses || []).filter((item) => item.completed),
    inProgressCourses: (state) => (state.continueCourses || []).filter((item) => !item.completed)
  },
  actions: {
    async fetchContinueLearning() {
      this.loading = true
      this.errors = {}
      const enrollmentStore = useStudentEnrolledCourseStore()
      const historyStore = useStudentWatchHistoryStore()
      try {
        await Promise.all([enrollmentStore.fetchEnrolledCourses(), historyStore.fetchWatchHistory()])
        const { data } = await api.get('/student/continue-learning')
          this.continueCourses = data.continue_learning || []
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to load continue learning.' }
        }
        this.continueCourses = buildContinueCourses()
      } finally {
        this.loading = false
      }
    },
    async saveWatchProgress(payload) {
      this.saving = true
      this.errors = {}
      const historyStore = useStudentWatchHistoryStore()
      try {
        await api.post('/student/continue-learning/progress', payload)
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to save watch progress.' }
          throw error
        }
      } finally {
        await historyStore.updateLastWatched(payload)
        this.continueCourses = buildContinueCourses()
        this.saving = false
      }
    },
    async resumeLesson(item) {
      await this.saveWatchProgress({
        courseId: item.course?.id || item.courseId,
        courseTitle: item.courseTitle,
        lessonId: item.lessonId,
        lessonTitle: item.lessonTitle,
        watchedDuration: item.watchedDuration,
        progress: item.progress,
        completed: item.completed
      })
      return `/student/courses/${item.course?.id || item.courseId}`
    }
  }
})
