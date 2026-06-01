import api from '@/services/api'

export const courseService = {
  list: (params = {}) => api.get('/courses', { params }),
  show: (slug) => api.get(`/courses/${slug}`)
}
