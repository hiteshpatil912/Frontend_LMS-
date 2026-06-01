import { defineStore } from 'pinia'
import { quizService } from '@/services/quizService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process quiz request.') => {
  const status = error.response?.status
  const data = error.response?.data

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to access this quiz.',
    404: 'Quiz data was not found.',
    422: 'Please answer all required questions before submitting.',
    500: 'The server could not process the quiz right now.'
  }

  return {
    status,
    message: messages[status] || data?.message || fallback,
    validation: data?.errors || {}
  }
}

const normalizeQuiz = (quiz) => ({
  id: quiz.id,
  title: quiz.title || quiz.name || 'Untitled Quiz',
  totalQuestions: Number(quiz.total_questions || quiz.questions_count || quiz.totalQuestions || quiz.questions?.length || 0)
})

const normalizeQuestion = (question) => ({
  id: question.id,
  question: question.question || question.title || '',
  options: [
    question.option_1,
    question.option_2,
    question.option_3,
    question.option_4
  ].filter(Boolean)
})

const normalizeAttempt = (payload) => {
  const quiz = payload.quiz || payload

  return {
    id: quiz.id,
    title: quiz.title || quiz.name || 'Untitled Quiz',
    questions: (quiz.questions || []).map(normalizeQuestion)
  }
}

const normalizeResult = (payload) => {
  const result = payload.result || payload
  const scorePercentage = Number(result.score_percentage ?? result.scorePercentage ?? result.percentage ?? 0)

  return {
    quizId: result.quiz_id || result.quizId,
    totalQuestions: Number(result.total_questions || result.totalQuestions || 0),
    correctAnswers: Number(result.correct_answers || result.correctAnswers || 0),
    scorePercentage,
    passed: scorePercentage >= 60
  }
}

export const useLmsQuizStore = defineStore('lmsQuizzes', {
  state: () => ({
    quizzes: [],
    activeQuiz: null,
    answers: {},
    result: null,
    loading: false,
    submitting: false,
    error: null
  }),

  getters: {
    hasQuizzes: (state) => state.quizzes.length > 0,
    questions: (state) => state.activeQuiz?.questions || [],
    answeredCount: (state) => Object.keys(state.answers).length
  },

  actions: {
    clearError() {
      this.error = null
    },

    async fetchQuizzes() {
      this.loading = true
      this.clearError()

      try {
        const response = await quizService.getQuizzes()
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

    async startQuiz(id) {
      this.loading = true
      this.clearError()
      this.answers = {}
      this.result = null

      try {
        const response = await quizService.attemptQuiz(id)
        this.activeQuiz = normalizeAttempt(unwrap(response))
        return this.activeQuiz
      } catch (error) {
        this.error = normalizeError(error, 'Unable to start quiz.')
        throw error
      } finally {
        this.loading = false
      }
    },

    answerQuestion(questionId, answer) {
      this.answers = {
        ...this.answers,
        [String(questionId)]: answer
      }
    },

    async submitQuiz(id) {
      this.submitting = true
      this.clearError()

      try {
        const response = await quizService.submitQuiz(id, this.answers)
        this.result = normalizeResult(unwrap(response))
        return this.result
      } catch (error) {
        this.error = normalizeError(error, 'Unable to submit quiz.')
        throw error
      } finally {
        this.submitting = false
      }
    },

    async fetchResult(id) {
      this.loading = true
      this.clearError()

      try {
        const response = await quizService.getQuizResult(id)
        this.result = normalizeResult(unwrap(response))
        return this.result
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load quiz result.')
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
