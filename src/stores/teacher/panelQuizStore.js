import { defineStore } from 'pinia'
import { teacherQuizService } from '@/services/teacherQuizService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process quizzes.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to manage quizzes.',
    404: 'Quiz data was not found.',
    422: 'Please check the quiz form fields.',
    500: 'The server could not process quizzes right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback,
    validation: error.response?.data?.errors || {}
  }
}

const normalizeQuiz = (quiz) => ({
  id: quiz.id,
  title: quiz.title || quiz.name || 'Untitled Quiz',
  description: quiz.description || '',
  totalMarks: Number(quiz.total_marks || quiz.totalMarks || quiz.marks || 0),
  createdAt: quiz.created_at || quiz.createdAt || null
})

export const useTeacherPanelQuizStore = defineStore('teacherPanelQuizzes', {
  state: () => ({
    quizzes: [],
    loading: false,
    saving: false,
    deletingId: null,
    error: null
  }),

  getters: {
    hasQuizzes: (state) => state.quizzes.length > 0
  },

  actions: {
    clearError() {
      this.error = null
    },

    async fetchQuizzes(lessonId) {
      this.loading = true
      this.clearError()

      try {
        const response = await teacherQuizService.getQuizzes(lessonId)
        const payload = unwrap(response)
        const quizzes = Array.isArray(payload) ? payload : payload.quizzes || payload.data || []
        this.quizzes = quizzes.map(normalizeQuiz)
        return this.quizzes
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load quizzes.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async createQuiz(lessonId, payload) {
      this.saving = true
      this.clearError()

      try {
        const response = await teacherQuizService.createQuiz(lessonId, payload)
        const quiz = normalizeQuiz(unwrap(response).quiz || unwrap(response))
        this.quizzes.unshift(quiz)
        return quiz
      } catch (error) {
        this.error = normalizeError(error, 'Unable to create quiz.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async updateQuiz(id, payload) {
      this.saving = true
      this.clearError()

      try {
        const response = await teacherQuizService.updateQuiz(id, payload)
        const quiz = normalizeQuiz(unwrap(response).quiz || unwrap(response))
        const index = this.quizzes.findIndex((item) => String(item.id) === String(id))

        if (index >= 0) {
          this.quizzes.splice(index, 1, quiz)
        }

        return quiz
      } catch (error) {
        this.error = normalizeError(error, 'Unable to update quiz.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async deleteQuiz(id) {
      this.deletingId = id
      this.clearError()

      try {
        await teacherQuizService.deleteQuiz(id)
        this.quizzes = this.quizzes.filter((quiz) => String(quiz.id) !== String(id))
      } catch (error) {
        this.error = normalizeError(error, 'Unable to delete quiz.')
        throw error
      } finally {
        this.deletingId = null
      }
    }
  }
})
