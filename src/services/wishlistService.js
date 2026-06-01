import api from '@/services/api'

export const wishlistService = {
  getMyWishlist: () => api.get('/my-wishlist'),
  addToWishlist: (courseId) => api.post(`/courses/${courseId}/wishlist`)
}
