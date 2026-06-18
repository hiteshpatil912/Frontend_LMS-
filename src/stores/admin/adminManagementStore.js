import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useAdminManagementStore = defineStore('adminManagement', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchData(resource) {
      this.loading = true
      this.error = null
      this.items = []
      try {
        const { data } = await api.get(`/admin/${resource}`)
        // Standard normalization for collection responses
        this.items = data.data || data.items || data || []
      } catch (err) {
        this.error = err.response?.data?.message || `Unable to load ${resource}.`
        console.error(`Admin Fetch Error [${resource}]:`, err)
      } finally {
        this.loading = false
      }
    }
  }
})