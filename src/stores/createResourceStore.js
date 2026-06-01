import { defineStore } from 'pinia'
import { resourceService } from '@/services/resourceService'

export function createResourceStore(id, resource, seed = []) {
  const service = resourceService(resource)

  return defineStore(id, {
    state: () => ({
      items: seed,
      current: null,
      loading: false,
      error: null
    }),
    getters: {
      total: (state) => state.items.length,
      activeItems: (state) => state.items.filter((item) => item.status !== 'archived')
    },
    actions: {
      async fetchAll(params = {}) {
        this.loading = true
        this.error = null
        try {
          const { data } = await service.list(params)
          this.items = data.data || data
        } catch (error) {
          this.error = error.response?.data?.message || error.message
        } finally {
          this.loading = false
        }
      },
      async fetchOne(id) {
        this.loading = true
        this.error = null
        try {
          const { data } = await service.get(id)
          this.current = data.data || data
        } catch (error) {
          this.error = error.response?.data?.message || error.message
        } finally {
          this.loading = false
        }
      },
      async save(payload) {
        this.loading = true
        this.error = null
        try {
          const request = payload.id ? service.update(payload.id, payload) : service.create(payload)
          const { data } = await request
          const saved = data.data || data
          const index = this.items.findIndex((item) => item.id === saved.id)
          if (index >= 0) this.items[index] = saved
          else this.items.unshift(saved)
          return saved
        } catch (error) {
          this.error = error.response?.data?.message || error.message
          throw error
        } finally {
          this.loading = false
        }
      },
      async remove(id) {
        this.loading = true
        this.error = null
        try {
          await service.remove(id)
          this.items = this.items.filter((item) => item.id !== id)
        } catch (error) {
          this.error = error.response?.data?.message || error.message
          throw error
        } finally {
          this.loading = false
        }
      }
    }
  })
}
