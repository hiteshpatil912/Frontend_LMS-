import { defineStore } from 'pinia'
import api from '@/plugins/axios'


const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)
const extractErrors = (error, fallback) => error.response?.data?.errors || { general: error.response?.data?.message || fallback }

export const createResourceModuleStore = (storeId, basePath, defaults = []) =>
  defineStore(storeId, {
    state: () => ({
      resources: [],
      currentResource: null,
      loading: false,
      uploading: false,
      deleting: false,
      downloading: false,
      errors: {}
    }),
    getters: {
      items: (state) => state.resources,
      publishedResources: (state) => (state.resources || []).filter((resource) => resource.visibility === 'published'),
totalResources: (state) =>
  (state.resources || []).length,
      resourcesByCourse: (state) => (courseId) => (state.resources || []).filter((resource) => String(resource.courseId) === String(courseId))
    },
    actions: {
      async fetchResources(params = {}) {
        this.loading = true
        this.errors = {}
        try {
          const { data } = await api.get(basePath, { params })
          this.resources = data.resources || []
        } catch (error) {
          this.errors = { general: 'Unable to sync resources. Showing local resource data.' }
        } finally {
          this.loading = false
        }
      },
      async fetchSingleResource(id) {
        this.loading = true
        this.errors = {}
        try {
          const { data } = await api.get(`${basePath}/${id}`)
          this.currentResource = data.resource || null
        } catch (error) {
          this.currentResource =
          (this.resources || []).find((resource) => String(resource.id) === String(id)) || null
          if (!this.currentResource) this.errors = { general: ' Unable to sync resources. Showing local resource data.' }
        } finally {
          this.loading = false
        }
      },
      async uploadResource(payload) {
        this.uploading = true
        this.errors = {}
        try {
          const { data } = await api.post(basePath, payload)
          const resource = normalize(data)
          this.resources.unshift(resource)
          return resource
        } catch (error) {
          if (!shouldUseLocalFallback(error)) {
            this.errors = extractErrors(error, 'Unable to upload resource.')
            throw error
          }
          const resource = { ...payload, id: Date.now(), uploadedAt: new Date().toISOString().slice(0, 10) }
          this.resources.unshift(resource)
          return resource
        } finally {
          this.uploading = false
        }
      },
      async deleteResource(id) {
        this.deleting = true
        this.errors = {}
        try {
          await api.delete(`${basePath}/${id}`)
        } catch (error) {
          if (!shouldUseLocalFallback(error)) {
            this.errors = { general: error.response?.data?.message || 'Unable to delete resource.' }
            throw error
          }
        } finally {
          this.resources = this.resources.filter((resource) => String(resource.id) !== String(id))
          this.deleting = false
        }
      },
      async downloadResource(resource) {
        this.downloading = true
        this.errors = {}
        try {
          await api.get(`${basePath}/${resource.id}/download`, { responseType: 'blob' })
          return resource
        } catch (error) {
          if (!shouldUseLocalFallback(error)) {
            this.errors = { general: error.response?.data?.message || 'Unable to download resource.' }
            throw error
          }
          return resource
        } finally {
          this.downloading = false
        }
      }
    }
  })

export const useAdminResourceStore = createResourceModuleStore('adminResources', '/admin/resources')
