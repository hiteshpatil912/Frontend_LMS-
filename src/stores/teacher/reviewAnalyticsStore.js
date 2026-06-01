import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { mockReviews } from '@/stores/student/reviewStore'

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

const buildSummary = (reviews) => {
  const totalReviews = reviews.length
  const averageRating = totalReviews ? Number((reviews.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews).toFixed(1)) : 0
  const breakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => Number(review.rating) === rating).length
  }))
  const courseMap = reviews.reduce((map, review) => {
    map[review.courseId] ||= { courseId: review.courseId, courseTitle: review.courseTitle, reviews: [] }
    map[review.courseId].reviews.push(review)
    return map
  }, {})
  const courseRatings = Object.values(courseMap).map((course) => ({
    ...course,
    totalReviews: course.reviews.length,
    averageRating: Number((course.reviews.reduce((sum, review) => sum + Number(review.rating), 0) / course.reviews.length).toFixed(1))
  }))

  return { totalReviews, averageRating, breakdown, courseRatings, recentReviews: reviews.slice(0, 8) }
}

export const useTeacherReviewAnalyticsStore = defineStore('teacherReviewAnalytics', {
  state: () => ({
    reviews: [...mockReviews],
    summary: buildSummary(mockReviews),
    loading: false,
    deleting: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.reviews,
    topRatedCourses: (state) => [...state.summary.courseRatings].sort((a, b) => b.averageRating - a.averageRating),
    lowRatedReviews: (state) => state.reviews.filter((review) => Number(review.rating) <= 3)
  },
  actions: {
    async fetchReviews(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/teacher/reviews', { params })
        this.reviews = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync review analytics. Showing local review data.' }
      } finally {
        this.summary = buildSummary(this.reviews)
        this.loading = false
      }
    },
    async fetchCourseRatings(courseId = null) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(courseId ? `/teacher/admin/courses/${courseId}/ratings` : '/teacher/ratings')
        this.summary = normalize(data)
      } catch (error) {
        this.summary = buildSummary(courseId ? this.reviews.filter((review) => String(review.courseId) === String(courseId)) : this.reviews)
      } finally {
        this.loading = false
      }
      return this.summary
    },
    async deleteReview(id) {
      this.deleting = true
      this.errors = {}
      try {
        await api.delete(`/teacher/reviews/${id}`)
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to delete review.' }
          throw error
        }
      } finally {
        this.reviews = this.reviews.filter((review) => String(review.id) !== String(id))
        this.summary = buildSummary(this.reviews)
        this.deleting = false
      }
    }
  }
})
