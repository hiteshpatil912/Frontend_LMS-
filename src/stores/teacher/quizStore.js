import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const mockQuizzes = [
  {
    id: 1,
    title: 'Discovery Principles',
    description: 'Validate core discovery and product research concepts.',
    courseId: 1,
    courseName: 'Product Strategy Masterclass',
    passingMarks: 70,
    duration: 15,
    status: 'published',
    attempts: 620,
    questions: [
      {
        id: 101,
        title: 'What is the goal of product discovery?',
        options: { A: 'Validate opportunities', B: 'Ship faster only', C: 'Avoid research', D: 'Freeze scope' },
        correctAnswer: 'A',
        marks: 10
      },
      {
        id: 102,
        title: 'Which input best supports prioritization?',
        options: { A: 'Opinion', B: 'Customer evidence', C: 'Random requests', D: 'Team size' },
        correctAnswer: 'B',
        marks: 10
      }
    ]
  },
  {
    id: 2,
    title: 'Accessibility Basics',
    description: 'Assess basic accessible design principles.',
    courseId: 2,
    courseName: 'UX Research Systems',
    passingMarks: 60,
    duration: 10,
    status: 'draft',
    attempts: 410,
    questions: []
  }
]

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)
const extractErrors = (error, fallback) => {
  if (error.response?.data?.errors) return error.response.data.errors
  return { general: error.response?.data?.message || fallback }
}

export const useTeacherQuizStore = defineStore('teacherQuizzes', {
  state: () => ({
    quizzes: mockQuizzes,
    currentQuiz: null,
    loading: false,
    saving: false,
    deleting: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.quizzes,
    totalQuizzes: (state) => state.quizzes.length,
    publishedQuizzes: (state) => state.quizzes.filter((quiz) => quiz.status === 'published')
  },
  actions: {
    async fetchQuizzes() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/teacher/quizzes')
        this.quizzes = normalize(data)
      } catch (error) {
        this.errors = { general: error.response?.data?.message || 'Unable to load quizzes. Showing local quiz defaults.' }
        this.quizzes = mockQuizzes
      } finally {
        this.loading = false
      }
    },
    async fetchSingleQuiz(id) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/teacher/quizzes/${id}`)
        this.currentQuiz = normalize(data)
      } catch (error) {
        this.currentQuiz = this.quizzes.find((quiz) => String(quiz?.id) === String(id)) || null
        if (!this.currentQuiz) this.errors = extractErrors(error, 'Quiz not found.')
      } finally {
        this.loading = false
      }
    },
    async createQuiz(payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.post('/teacher/quizzes', payload)
        const quiz = normalize(data)
        this.quizzes.unshift(quiz)
        return quiz
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to create quiz.')
          throw error
        }
        const quiz = { ...payload, id: Math.max(0, ...this.quizzes.map((item) => item.id)) + 1, attempts: 0 }
        this.quizzes.unshift(quiz)
        return quiz
      } finally {
        this.saving = false
      }
    },
    async updateQuiz(id, payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.put(`/teacher/quizzes/${id}`, payload)
        const quiz = normalize(data)
        const index = this.quizzes.findIndex((item) => String(item.id) === String(id))
        if (index >= 0) this.quizzes[index] = quiz
        this.currentQuiz = quiz
        return quiz
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to update quiz.')
          throw error
        }
        const existing = this.quizzes.find((item) => String(item.id) === String(id))
        const quiz = { ...existing, ...payload, id: Number(id) }
        const index = this.quizzes.findIndex((item) => String(item.id) === String(id))
        if (index >= 0) this.quizzes[index] = quiz
        this.currentQuiz = quiz
        return quiz
      } finally {
        this.saving = false
      }
    },
    async deleteQuiz(id) {
      this.deleting = true
      this.errors = {}
      try {
        await api.delete(`/teacher/quizzes/${id}`)
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to delete quiz.')
          throw error
        }
      } finally {
        this.quizzes = this.quizzes.filter((quiz) => String(quiz?.id) !== String(id))
        this.deleting = false
      }
    },
    async addQuestion(quizId, question) {
      const quiz = this.quizzes.find((item) => String(item.id) === String(quizId))
      if (!quiz) return null
      const nextQuestion = { ...question, id: Date.now() }
      quiz.questions.push(nextQuestion)
      if (String(this.currentQuiz?.id) === String(quizId)) this.currentQuiz = quiz
      return nextQuestion
    }
  }
})
