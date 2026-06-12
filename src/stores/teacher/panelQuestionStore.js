import { defineStore } from 'pinia'
import { teacherQuestionService } from '@/services/teacherQuestionService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process questions.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to manage questions.',
    404: 'Question data was not found.',
    422: 'Please check the question form fields.',
    500: 'The server could not process questions right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback,
    validation: error.response?.data?.errors || {}
  }
}

const normalizeQuestion = (question) => ({
  id: question.id,
  question: question.question || question.title || '',
  option1: question.option_a || question.option_1 || question.option1 || '',
  option2: question.option_b || question.option_2 || question.option2 || '',
  option3: question.option_c || question.option_3 || question.option3 || '',
  option4: question.option_d || question.option_4 || question.option4 || '',
  correctAnswer: question.correct_answer || question.correctAnswer || ''
})

export const useTeacherPanelQuestionStore = defineStore('teacherPanelQuestions', {
  state: () => ({
    questions: [],
    loading: false,
    saving: false,
    deletingId: null,
    error: null
  }),

  getters: {
    hasQuestions: (state) => state.questions.length > 0
  },

  actions: {
    clearError() {
      this.error = null
    },

    async fetchQuestions(quizId) {
      this.loading = true
      this.clearError()

      try {
        const response = await teacherQuestionService.getQuestions(quizId)
        const payload = unwrap(response)
        const questions = Array.isArray(payload) ? payload : payload.questions || payload.data || []
        this.questions = questions.map(normalizeQuestion)
        return this.questions
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load questions.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async createQuestion(quizId, payload) {
      this.saving = true
      this.clearError()

      try {
        const response = await teacherQuestionService.createQuestion(quizId, payload)
        const question = normalizeQuestion(unwrap(response).question || unwrap(response))
        this.questions.unshift(question)
        return question
      } catch (error) {
        this.error = normalizeError(error, 'Unable to create question.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async updateQuestion(id, payload) {
      this.saving = true
      this.clearError()

      try {
        const response = await teacherQuestionService.updateQuestion(id, payload)
        const question = normalizeQuestion(unwrap(response).question || unwrap(response))
        const index = this.questions.findIndex((item) => String(item.id) === String(id))

        if (index >= 0) {
          this.questions.splice(index, 1, question)
        }

        return question
      } catch (error) {
        this.error = normalizeError(error, 'Unable to update question.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async deleteQuestion(id) {
      this.deletingId = id
      this.clearError()

      try {
        await teacherQuestionService.deleteQuestion(id)
        this.questions = this.questions.filter((question) => String(question.id) !== String(id))
      } catch (error) {
        this.error = normalizeError(error, 'Unable to delete question.')
        throw error
      } finally {
        this.deletingId = null
      }
    }
  }
})
