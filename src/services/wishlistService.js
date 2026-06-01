import api from '@/services/api'

export const wishlistService = {
  list: () => api.get('/wishlist'),
  add: (courseId) => api.post('/wishlist', { course_id: courseId }),
  remove: (courseId) => api.delete(`/wishlist/${courseId}`)
}
