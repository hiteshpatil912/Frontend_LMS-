import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth/authStore'
import { useStudentEnrolledCourseStore } from '@/stores/student/enrolledCourseStore'

export const mockReviews = [
  {
    id: 1,
    courseId: 1,
    courseTitle: 'UX Research Systems',
    studentId: 201,
    studentName: 'Amara Lewis',
    rating: 5,
    title: 'Practical and clear',
    comment: 'The research planning templates made it much easier to run stakeholder interviews.',
    status: 'published',
    createdAt: '2026-05-14'
  },
  {
    id: 2,
    courseId: 2,
    courseTitle: 'Data Analytics for Teams',
    studentId: 202,
    studentName: 'Rohan Mehta',
    rating: 4,
    title: 'Strong analytics foundation',
    comment: 'Great structure for teams that need a shared vocabulary around metrics.',
    status: 'published',
    createdAt: '2026-05-15'
  },
  {
    id: 3,
    courseId: 3,
    courseTitle: 'Product Strategy Masterclass',
    studentId: 203,
    studentName: 'Sofia Chen',
    rating: 5,
    title: 'Excellent strategy course',
    comment: 'The opportunity mapping lesson was immediately useful for roadmap planning.',
    status: 'published',
    createdAt: '2026-05-16'
  }
]

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

const summarize = (reviews) => {
  const totalReviews = reviews.length
  const averageRating = totalReviews ? Number((reviews.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews).toFixed(1)) : 0
  const breakdown = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => Number(review.rating) === rating).length
  }))

  return { totalReviews, averageRating, breakdown, recentReviews: reviews.slice(0, 5) }
}

export const useStudentReviewStore = defineStore('studentReviews', {
  state: () => ({
    reviews: [...mockReviews],
    courseRatings: {},
    currentReview: null,
    loading: false,
    saving: false,
    deleting: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.reviews,
    reviewsForCourse: (state) => (courseId) => state.reviews.filter((review) => String(review.courseId) === String(courseId)),
    myReviewForCourse: (state) => (courseId) => {
      const authStore = useAuthStore()
      const studentId = authStore.user?.id || 'demo-student'
      return state.reviews.find((review) => String(review.courseId) === String(courseId) && String(review.studentId) === String(studentId))
    },
    ratingSummary: (state) => (courseId) => summarize(state.reviews.filter((review) => String(review.courseId) === String(courseId)))
  },
  actions: {
    assertCanReview(courseId) {
      const enrollmentStore = useStudentEnrolledCourseStore()
      if (!enrollmentStore.isEnrolled(courseId)) {
        this.errors = { general: 'Only enrolled students can review this course.' }
        throw new Error(this.errors.general)
      }
    },
    async fetchReviews(courseId = null) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(courseId ? `/student/admin/courses/${courseId}/reviews` : '/student/reviews')
        this.reviews = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync reviews. Showing local review data.' }
      } finally {
        this.loading = false
      }
    },
    async fetchCourseRatings(courseId) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/admin/courses/${courseId}/ratings`)
        this.courseRatings[courseId] = normalize(data)
      } catch (error) {
        this.courseRatings[courseId] = this.ratingSummary(courseId)
      } finally {
        this.loading = false
      }
      return this.courseRatings[courseId]
    },
    async submitReview(courseId, payload) {
      this.saving = true
      this.errors = {}
      const enrollmentStore = useStudentEnrolledCourseStore()
      const authStore = useAuthStore()
      this.assertCanReview(courseId)
      if (this.myReviewForCourse(courseId)) {
        this.errors = { general: 'You already reviewed this course. Edit your existing review instead.' }
        this.saving = false
        throw new Error(this.errors.general)
      }

      try {
        const { data } = await api.post(`/student/admin/courses/${courseId}/reviews`, payload)
        const review = normalize(data)
        this.reviews.unshift(review)
        return review
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = error.response?.data?.errors || { general: error.response?.data?.message || 'Unable to submit review.' }
          throw error
        }
        const course = enrollmentStore.enrolledCourses.find((item) => String(item.id) === String(courseId))
        const review = {
          ...payload,
          id: Date.now(),
          courseId: Number(courseId),
          courseTitle: course?.title || 'Course',
          studentId: authStore.user?.id || 'demo-student',
          studentName: authStore.user?.name || 'Demo Student',
          status: 'published',
          createdAt: new Date().toISOString().slice(0, 10)
        }
        this.reviews.unshift(review)
        return review
      } finally {
        this.saving = false
      }
    },
    async updateReview(id, payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.put(`/student/reviews/${id}`, payload)
        const review = normalize(data)
        this.reviews = this.reviews.map((item) => (String(item.id) === String(id) ? { ...item, ...review } : item))
        return review
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = error.response?.data?.errors || { general: error.response?.data?.message || 'Unable to update review.' }
          throw error
        }
        this.reviews = this.reviews.map((item) => (String(item.id) === String(id) ? { ...item, ...payload } : item))
        return this.reviews.find((item) => String(item.id) === String(id))
      } finally {
        this.saving = false
      }
    },
    async deleteReview(id) {
      this.deleting = true
      this.errors = {}
      try {
        await api.delete(`/student/reviews/${id}`)
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to delete review.' }
          throw error
        }
      } finally {
        this.reviews = this.reviews.filter((review) => String(review.id) !== String(id))
        this.deleting = false
      }
    }
  }
})
