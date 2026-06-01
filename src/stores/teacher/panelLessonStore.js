import { defineStore } from 'pinia'
import { teacherLessonService } from '@/services/teacherLessonService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process lessons.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to manage lessons.',
    404: 'Lesson data was not found.',
    422: 'Please check the lesson form fields.',
    500: 'The server could not process lessons right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback,
    validation: error.response?.data?.errors || {}
  }
}

const normalizeLesson = (lesson) => ({
  id: lesson.id,
  title: lesson.title || lesson.name || 'Untitled Lesson',
  description: lesson.description || '',
  videoUrl: lesson.video_url || lesson.videoUrl || lesson.video || '',
  pdfNotesUrl: lesson.pdf_notes_url || lesson.pdf_notes || lesson.pdfNotesUrl || lesson.notes_url || '',
  order: Number(lesson.order || lesson.lesson_order || lesson.position || 1),
  isPreview: Boolean(lesson.is_preview || lesson.preview || lesson.isPreview),
  createdAt: lesson.created_at || lesson.createdAt || null
})

export const useTeacherPanelLessonStore = defineStore('teacherPanelLessons', {
  state: () => ({
    lessons: [],
    loading: false,
    saving: false,
    deletingId: null,
    error: null
  }),

  getters: {
    sortedLessons: (state) => [...state.lessons].sort((a, b) => a.order - b.order || a.id - b.id),
    hasLessons: (state) => state.lessons.length > 0
  },

  actions: {
    clearError() {
      this.error = null
    },

    async fetchLessons(courseId) {
      this.loading = true
      this.clearError()

      try {
        const response = await teacherLessonService.getLessons(courseId)
        const payload = unwrap(response)
        const lessons = Array.isArray(payload) ? payload : payload.lessons || payload.data || []
        this.lessons = lessons.map(normalizeLesson)
        return this.lessons
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load lessons.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async createLesson(courseId, payload) {
      this.saving = true
      this.clearError()

      try {
        const response = await teacherLessonService.createLesson(courseId, payload)
        const lesson = normalizeLesson(unwrap(response).lesson || unwrap(response))
        this.lessons.push(lesson)
        return lesson
      } catch (error) {
        this.error = normalizeError(error, 'Unable to create lesson.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async updateLesson(id, payload) {
      this.saving = true
      this.clearError()

      try {
        const response = await teacherLessonService.updateLesson(id, payload)
        const lesson = normalizeLesson(unwrap(response).lesson || unwrap(response))
        const index = this.lessons.findIndex((item) => String(item.id) === String(id))

        if (index >= 0) {
          this.lessons.splice(index, 1, lesson)
        }

        return lesson
      } catch (error) {
        this.error = normalizeError(error, 'Unable to update lesson.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async deleteLesson(id) {
      this.deletingId = id
      this.clearError()

      try {
        await teacherLessonService.deleteLesson(id)
        this.lessons = this.lessons.filter((lesson) => String(lesson.id) !== String(id))
      } catch (error) {
        this.error = normalizeError(error, 'Unable to delete lesson.')
        throw error
      } finally {
        this.deletingId = null
      }
    }
  }
})
