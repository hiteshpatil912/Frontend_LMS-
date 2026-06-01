import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useStudentEnrolledCourseStore } from '@/stores/student/enrolledCourseStore'

export const useStudentProgressStore = defineStore('studentProgress', {
  state: () => ({
    progress: [],
    loading: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.progress,
    completedCourses: (state) => state.progress.filter((item) => item.status === 'completed'),
    inProgressCourses: (state) => state.progress.filter((item) => item.status === 'in_progress'),
    progressPercentage: (state) => (courseId) => state.progress.find((item) => String(item.courseId) === String(courseId))?.percentage || 0
  },
  actions: {
    buildLocalProgress() {

  const coursesStore = useStudentEnrolledCourseStore()

  this.progress = coursesStore.enrolledCourses.map((course) => {

    const lessons = course.lessons || []

    const completedLessons = lessons.filter(
      (lesson) => lesson.completed
    ).length

    const watchedVideos = lessons.filter(
      (lesson) => lesson.watched
    ).length

    const percentage = lessons.length
      ? Math.round(
          (completedLessons / lessons.length) * 100
        )
      : 0

    return {

      id: course.id,

      courseId: course.id,

      course: course.title,

      completedLessons,

      totalLessons: lessons.length,

      watchedVideos,

      percentage,

      completed: `${percentage}%`,

      score: `${Math.max(75, percentage)}%`,

      status:
        percentage === 100
          ? 'completed'
          : 'in_progress'

    }

  })

},
    async fetchProgress() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/progress')
        this.progress = data.data || data
      } catch (error) {
        this.errors = { general: error.response?.data?.message || 'Unable to sync progress. Showing local progress.' }
        this.buildLocalProgress()
      } finally {
        this.loading = false
      }
    },
    async markLessonComplete(courseId, lessonId) {
      this.loading = true
      this.errors = {}
      const coursesStore = useStudentEnrolledCourseStore()
      try {
        await api.post(`/student/admin/courses/${courseId}/lessons/${lessonId}/complete`)
      } catch (error) {
        if (error.response && ![404, 405].includes(error.response.status)) {
          this.errors = { general: error.response.data?.message || 'Unable to update lesson progress.' }
          throw error
        }
      } finally {
        coursesStore.updateLessonState(courseId, lessonId, { completed: true, watched: true })
        this.buildLocalProgress()
        this.loading = false
      }
    }
  }
})
