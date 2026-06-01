import { defineStore } from 'pinia'

export const useLmsUiStore = defineStore('lmsUi', {
  state: () => ({
    sidebarOpen: false,
    toasts: [],
    activeModal: null,
    globalLoading: false
  }),
  actions: {}
})
