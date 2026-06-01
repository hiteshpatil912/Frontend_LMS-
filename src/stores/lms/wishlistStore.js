import { defineStore } from 'pinia'

export const useLmsWishlistStore = defineStore('lmsWishlist', {
  state: () => ({
    items: [],
    courseIds: [],
    loading: false,
    errors: {}
  }),
  actions: {}
})
