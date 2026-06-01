import api from '@/services/api'

export const teacherQuestionService = {
  getQuestions: (quizId) => api.get(`/teacher/quizzes/${quizId}/questions`),
  createQuestion: (quizId, payload) => api.post(`/teacher/quizzes/${quizId}/questions`, payload),
  updateQuestion: (id, payload) => api.put(`/teacher/questions/${id}`, payload),
  deleteQuestion: (id) => api.delete(`/teacher/questions/${id}`)
}
