import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { mockQuizzes } from '@/stores/teacher/quizStore'

const normalize = (data) => data.data || data

export const useStudentQuizAttemptStore = defineStore('studentQuizAttempts', {
  state: () => ({
    quizzes: mockQuizzes.filter((quiz) => quiz.status === 'published'),
    currentQuiz: null,
    answers: {},
    result: null,
    loading: false,
    submitting: false,
    errors: {}
  }),
  getters: {
    totalMarks: (state) => (quiz = state.currentQuiz) => quiz?.questions.reduce((sum, question) => sum + Number(question.marks), 0) || 0
  },
  actions: {
    async fetchQuizzes() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/quizzes')
        this.quizzes = data.quizzes || []
      } catch (error) {
        this.errors = { general: error.response?.data?.message || 'Unable to load quizzes. Showing local quizzes.' }
      } finally {
        this.loading = false
      }
    },
    async attemptQuiz(id) {
      this.loading = true
      this.errors = {}
      this.answers = {}
      try {
        const { data } = await api.get(`/student/quizzes/${id}/attempt`)
        this.currentQuiz = normalize(data)
      } catch (error) {
        this.currentQuiz = (this.quizzes || []).find((quiz) => String(quiz?.id) === String(id)) || null
        if (!this.currentQuiz) this.errors = { general: 'Quiz not found.' }
      } finally {
        this.loading = false
      }
    },
    setAnswer(questionId, answer) {
      this.answers[questionId] = answer
    },
    async submitQuiz(id) {
      this.submitting = true
      this.errors = {}
      try {
        const { data } = await api.post(`/student/quizzes/${id}/submit`, { answers: this.answers })
        this.result = normalize(data)
      } catch (error) {
        const quiz = this.currentQuiz || (this.quizzes || []).find((item) => String(item.id) === String(id))
        const total = this.totalMarks(quiz)
        let score = 0
        let correctAnswers = 0
        quiz.questions.forEach((question) => {
          if (this.answers[question.id] === question.correctAnswer) {
            score += Number(question.marks)
            correctAnswers += 1
          }
        })
        const percentage = total ? Math.round((score / total) * 100) : 0
        this.result = {
          quizId: Number(id),
          quizTitle: quiz.title,
          totalScore: score,
          totalMarks: total,
          correctAnswers,
          wrongAnswers: quiz.questions.length - correctAnswers,
          percentage,
          passed: percentage >= Number(quiz.passingMarks)
        }
      } finally {
        this.submitting = false
      }
      return this.result
    },
    async fetchQuizResult(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/student/quizzes/${id}/result`)
        this.result = normalize(data)
      } catch {
        if (!this.result || String(this.result.quizId) !== String(id)) {
          await this.attemptQuiz(id)
          await this.submitQuiz(id)
        }
      } finally {
        this.loading = false
      }
    }
  }
})
