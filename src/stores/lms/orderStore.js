import { defineStore } from 'pinia'

export const useLmsOrderStore = defineStore('lmsOrders', {
  state: () => ({
    orders: [],
    order: null,
    checkoutCourse: null,
    loading: false,
    processing: false,
    errors: {}
  }),
  actions: {}
})
