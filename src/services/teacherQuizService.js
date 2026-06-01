import api from '@/services/api'

export const teacherQuizService = {
  getQuizzes: (lessonId) => api.get(`/teacher/lessons/${lessonId}/quizzes`),
  createQuiz: (lessonId, payload) => api.post(`/teacher/lessons/${lessonId}/quizzes`, payload),
  updateQuiz: (id, payload) => api.put(`/teacher/quizzes/${id}`, payload),
  deleteQuiz: (id) => api.delete(`/teacher/quizzes/${id}`)
}
