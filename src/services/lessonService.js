import api from '@/services/api'

export const lessonService = {
  list: (courseId) => api.get(`/courses/${courseId}/lessons`),
  show: (lessonId) => api.get(`/lessons/${lessonId}`)
}
