import { defineStore } from 'pinia'

export const useLmsNotificationStore = defineStore('lmsNotifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    errors: {}
  }),
  actions: {}
})
