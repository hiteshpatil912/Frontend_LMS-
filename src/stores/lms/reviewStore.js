import { defineStore } from 'pinia'

export const useLmsReviewStore = defineStore('lmsReviews', {
  state: () => ({
    reviews: [],
    ratingSummary: null,
    userReview: null,
    loading: false,
    errors: {}
  }),
  actions: {}
})
