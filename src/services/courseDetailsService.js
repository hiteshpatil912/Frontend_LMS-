import api from '@/services/api'

export const courseDetailsService = {
  getCourse: (courseId) => api.get(`/courses/${courseId}`),
  getLessons: (courseId) => api.get(`/courses/${courseId}/lessons`)
}
