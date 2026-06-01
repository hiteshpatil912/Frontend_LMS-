import { defineStore } from 'pinia'
import { courseDetailsService } from '@/services/courseDetailsService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const listFrom = (payload, ...keys) => {
  if (Array.isArray(payload)) return payload

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key]
  }

  if (Array.isArray(payload?.data)) return payload.data

  return []
}

const normalizeCourse = (payload) => {
  const course = payload.course || payload

  return {
    id: course.id,
    slug: course.slug || course.id,
    title: course.title || course.name || 'Untitled Course',
    description: course.description || course.short_description || '',
    thumbnail: course.thumbnail || course.thumbnail_url || course.image || course.cover_image || null,
    instructor: course.instructor?.name || course.teacher?.name || course.instructor_name || 'Instructor',
    totalLessons: Number(course.total_lessons || course.lessons_count || course.totalLessons || 0),
    progressPercentage: Number(course.progress_percentage || course.progress || 0)
  }
}

const normalizeLesson = (lesson) => ({
  id: lesson.id,
  title: lesson.title || lesson.name || 'Untitled Lesson',
  description: lesson.description || '',
  videoUrl: lesson.video_url || lesson.video || lesson.videoUrl || '',
  pdfNotes: lesson.pdf_notes || lesson.notes_url || lesson.pdf || lesson.pdfNotes || '',
  order: Number(lesson.order || lesson.position || 0),
  completed: Boolean(lesson.completed || lesson.is_completed || lesson.pivot?.completed)
})

const normalizeError = (error, fallback) => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to view this course.',
    404: 'Course data was not found.',
    500: 'The server could not load this course right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback
  }
}

export const useLmsCourseDetailsStore = defineStore('lmsCourseDetails', {
  state: () => ({
    course: null,
    lessons: [],
    loading: false,
    lessonsLoading: false,
    error: null
  }),

  getters: {
    sortedLessons: (state) => [...state.lessons].sort((a, b) => a.order - b.order || a.id - b.id),
    totalLessons: (state) => state.lessons.length || state.course?.totalLessons || 0,
    completedLessons: (state) => state.lessons.filter((lesson) => lesson.completed).length,
    lessonById: (state) => (lessonId) => state.lessons.find((lesson) => String(lesson.id) === String(lessonId)),
    lessonIndex: (state) => (lessonId) => state.lessons.findIndex((lesson) => String(lesson.id) === String(lessonId)),
    previousLesson: (state) => (lessonId) => {
      const index = state.lessons.findIndex((lesson) => String(lesson.id) === String(lessonId))
      return index > 0 ? state.lessons[index - 1] : null
    },
    nextLesson: (state) => (lessonId) => {
      const index = state.lessons.findIndex((lesson) => String(lesson.id) === String(lessonId))
      return index >= 0 && index < state.lessons.length - 1 ? state.lessons[index + 1] : null
    }
  },

  actions: {
    async fetchCourse(courseId) {
      this.loading = true
      this.error = null

      try {
        const response = await courseDetailsService.getCourse(courseId)
        this.course = normalizeCourse(unwrap(response))
        return this.course
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load course details.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchLessons(courseId) {
      this.lessonsLoading = true
      this.error = null

      try {
        const response = await courseDetailsService.getLessons(courseId)
        const payload = unwrap(response)
        this.lessons = listFrom(payload, 'lessons', 'items').map(normalizeLesson)
        return this.lessons
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load course lessons.')
        throw error
      } finally {
        this.lessonsLoading = false
      }
    },

    async fetchCourseDetails(courseId) {
      const [course] = await Promise.all([
        this.fetchCourse(courseId),
        this.fetchLessons(courseId)
      ])

      return course
    },

    markLessonComplete(lessonId) {
      this.lessons = this.lessons.map((lesson) =>
        String(lesson.id) === String(lessonId) ? { ...lesson, completed: true } : lesson
      )
    },

    applyProgress(progress) {
      if (this.course) {
        this.course.progressPercentage = progress.percentage
      }

      const completedIds = new Set(progress.completedLessonIds.map(String))
      this.lessons = this.lessons.map((lesson) => ({
        ...lesson,
        completed: lesson.completed || completedIds.has(String(lesson.id))
      }))
    }
  }
})
