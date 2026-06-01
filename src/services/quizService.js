import api from '@/services/api'

export const quizService = {
  getQuizzes: () => api.get('/quizzes'),
  attemptQuiz: (id) => api.get(`/quizzes/${id}/attempt`),
  submitQuiz: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  getQuizResult: (id) => api.get(`/quizzes/${id}/result`)
}
