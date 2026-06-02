import api from '@/services/api'

export const quizService = {
  getQuizzes: () => api.get('/student/quizzes'),

  attemptQuiz: (id) =>
    api.get(`/student/quizzes/${id}/attempt`),

  submitQuiz: (id, answers) =>
    api.post(`/student/quizzes/${id}/submit`, { answers }),

  getQuizResult: (id) =>
    api.get(`/student/quizzes/${id}/result`)
}
