import { defineStore } from 'pinia'
import { teacherReviewService } from '@/services/teacherReviewService'

const normalizeError = (error, fallback = 'Unable to process reviews.') => ({
  status: error.response?.status,
  message: error.response?.data?.message || fallback,
  validation: error.response?.data?.errors || {}
})

const reviewListFrom = (response) => {
  const payload = response?.data
  const data = payload?.data

  if (Array.isArray(data?.reviews)) return data.reviews
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(payload?.reviews)) return payload.reviews

  return []
}

const formatDate = (value) => {
  if (!value) return 'Not available'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString().slice(0, 10)
}

const normalizeReview = (review) => ({
  id: review.review_id ?? review.id ?? `${review.course_id || 'course'}-${review.created_at || Math.random()}`,
  student: review.student_name || review.student?.name || 'Student',
  course: review.course_title || review.course?.title || `Course #${review.course_id || 'unknown'}`,
  rating: Number(review.rating || 0),
  comment: review.comment || '',
  date: formatDate(review.created_at)
})

export const useTeacherPanelReviewStore = defineStore('teacherPanelReviews', {
  state: () => ({
    reviews: [],
    loading: false,
    error: null
  }),

  actions: {
    clearError() {
      this.error = null
    },

    async fetchReviews() {
      this.loading = true
      this.clearError()

      try {
        const response = await teacherReviewService.getReviews()
        this.reviews = reviewListFrom(response).map(normalizeReview)
        return this.reviews
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load reviews.')
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
