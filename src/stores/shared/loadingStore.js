import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    requests: 0,
    message: ''
  }),
  getters: {
    isLoading: (state) => state.requests > 0
  },
  actions: {
    start(message = 'Loading') {
      this.requests += 1
      this.message = message
    },
    finish() {
      this.requests = Math.max(0, this.requests - 1)
      if (this.requests === 0) this.message = ''
    }
  }
})
