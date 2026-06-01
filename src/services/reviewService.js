import api from '@/services/api'

export const reviewService = {
  list: (courseId) => api.get(`/courses/${courseId}/reviews`),
  create: (courseId, payload) => api.post(`/courses/${courseId}/reviews`, payload)
}
