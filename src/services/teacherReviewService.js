import api from '@/services/api'

export const teacherReviewService = {
  getReviews: () => api.get('/teacher/reviews')
}
