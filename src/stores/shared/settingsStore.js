import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    locale: 'en',
    theme: 'light',
    density: 'comfortable',
    emailDigest: true,
    loading: false,
    error: null
  }),
  getters: {
    isCompact: (state) => state.density === 'compact'
  },
  actions: {
    async saveSettings(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.put('/settings', payload)
        Object.assign(this, data.data || data)
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
