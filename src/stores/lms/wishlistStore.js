import { defineStore } from 'pinia'
import { wishlistService } from '@/services/wishlistService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process wishlist request.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to access this wishlist.',
    404: 'Wishlist data was not found.',
    500: 'The server could not process wishlist data right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback
  }
}

const normalizeWishlistItem = (item) => {
  const course = item.course || item

  return {
    id: item.id || course.id,
    courseId: item.course_id || course.id,
    title: course.title || course.name || item.course_title || 'Untitled Course',
    thumbnail: course.thumbnail || course.thumbnail_url || course.image || course.cover_image || null,
    addedDate: item.created_at || item.added_at || item.addedDate || null
  }
}

const normalizeSuccessMessage = (payload) => {
  return payload.message || payload.status || 'Course Added To Wishlist'
}

export const useLmsWishlistStore = defineStore('lmsWishlist', {
  state: () => ({
    wishlists: [],
    loading: false,
    adding: false,
    error: null,
    message: ''
  }),

  getters: {
    hasWishlist: (state) => state.wishlists.length > 0,
    courseIds: (state) => state.wishlists.map((item) => String(item.courseId)).filter(Boolean),
    hasCourse: (state) => (courseId) => state.courseIds.includes(String(courseId))
  },

  actions: {
    clearStatus() {
      this.error = null
      this.message = ''
    },

    async fetchWishlist() {
      this.loading = true
      this.clearStatus()

      try {
        const response = await wishlistService.getMyWishlist()
        const payload = unwrap(response)
        const items = Array.isArray(payload) ? payload : payload.wishlists || payload.wishlist || payload.data || []
        this.wishlists = items.map(normalizeWishlistItem)
        return this.wishlists
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load wishlist.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async addToWishlist(courseId) {
      this.adding = true
      this.clearStatus()

      try {
        const response = await wishlistService.addToWishlist(courseId)
        const payload = unwrap(response)

        this.message = normalizeSuccessMessage(payload)

        if (payload.course || payload.wishlist || payload.item) {
          const item = normalizeWishlistItem(payload.wishlist || payload.item || payload.course)

          if (!this.hasCourse(item.courseId)) {
            this.wishlists.unshift(item)
          }
        }

        return this.message
      } catch (error) {
        const status = error.response?.status
        const message = error.response?.data?.message || ''

        if (status === 409 || message.toLowerCase().includes('already')) {
          this.message = 'Course Already In Wishlist'
          return this.message
        }

        this.error = normalizeError(error, 'Unable to add course to wishlist.')
        throw error
      } finally {
        this.adding = false
      }
    }
  }
})
