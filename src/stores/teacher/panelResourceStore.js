import { defineStore } from 'pinia'
import { teacherResourceService } from '@/services/teacherResourceService'

const normalizeError = (error, fallback = 'Unable to process resources.') => ({
  status: error.response?.status,
  message: error.response?.data?.message || fallback,
  validation: error.response?.data?.errors || {}
})

const resourceListFrom = (response) => {
  const payload = response?.data
  const data = payload?.data

  if (Array.isArray(data?.resources)) return data.resources
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(payload?.resources)) return payload.resources
  if (Array.isArray(payload)) return payload

  return []
}

const formatDate = (value) => {
  if (!value) return 'Not available'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString().slice(0, 10)
}

const normalizeResource = (resource) => ({
  id: resource.id,
  title: resource.title || 'Untitled Resource',
  description: resource.description || '',
  fileUrl: resource.file_url || resource.fileUrl || resource.url || '',
  createdDate: formatDate(resource.created_at || resource.createdAt),
  raw: resource
})

export const useTeacherPanelResourceStore = defineStore('teacherPanelResources', {
  state: () => ({
    resources: [],
    loading: false,
    saving: false,
    deletingId: null,
    error: null
  }),

  actions: {
    clearError() {
      this.error = null
    },

    async fetchResources() {
      this.loading = true
      this.clearError()

      try {
        const response = await teacherResourceService.getResources()
        this.resources = resourceListFrom(response).map(normalizeResource)
        return this.resources
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load resources.')
        throw error
      } finally {
        this.loading = false
      }
    },

   async createResource(courseId, payload) {
  this.saving = true
  this.clearError()

  try {
    await teacherResourceService.createResource(courseId, payload)
    await this.fetchResources()
  } catch (error) {
    this.error = normalizeError(error, 'Unable to create resource.')
    throw error
  } finally {
    this.saving = false
  }
},

    async updateResource(id, payload) {
      this.saving = true
      this.clearError()

      try {
        await teacherResourceService.updateResource(id, payload)
        await this.fetchResources()
      } catch (error) {
        this.error = normalizeError(error, 'Unable to update resource.')
        throw error
      } finally {
        this.saving = false
      }
    },

    async deleteResource(id) {
      this.deletingId = id
      this.clearError()

      try {
        await teacherResourceService.deleteResource(id)
        await this.fetchResources()
      } catch (error) {
        this.error = normalizeError(error, 'Unable to delete resource.')
        throw error
      } finally {
        this.deletingId = null
      }
    }
  }
})
