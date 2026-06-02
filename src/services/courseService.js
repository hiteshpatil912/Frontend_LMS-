import api from '@/services/api'

export const courseService = {
  list: (params = {}) => api.get('/courses', { params }),
  show: (id) => api.get(`/courses/${id}`)
}
