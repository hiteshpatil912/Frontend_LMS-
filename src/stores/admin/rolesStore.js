import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { permissionCatalog } from '@/stores/admin/permissionsStore'

const mockRoles = [
  {
    id: 1,
    name: 'Admin',
    permissions: ['manage_users', 'manage_roles']
  },
  {
    id: 2,
    name: 'Teacher',
    permissions: ['manage_courses']
  },
  {
    id: 3,
    name: 'Student',
    permissions: ['view_courses']
  }
]

const normalize = (data) => data.data || data
const extractErrors = (error, fallback) => {
  if (error.response?.data?.errors) return error.response.data.errors
  return { general: error.response?.data?.message || fallback }
}
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useAdminRolesStore = defineStore('adminRoles', {
  state: () => ({
    roles: mockRoles,
    currentRole: null,
    permissions: permissionCatalog,
    loading: false,
    saving: false,
    deleting: false,
    errors: {}
  }),
  getters: {
    totalRoles: (state) => state.roles.length,
    permissionGroups: (state) => ({
      user: state.roles.flatMap((role) => role.permissions).filter((permission) => permission.includes('users')),
      role: state.roles.flatMap((role) => role.permissions).filter((permission) => permission.includes('roles')),
      course: state.roles.flatMap((role) => role.permissions).filter((permission) => permission.includes('courses'))
    })
  },
  actions: {
    async fetchRoles() {
      this.loading = true
      this.errors = {}

      try {
        const { data } = await api.get('/roles')
        this.roles = data.data || data
      } catch (error) {
        this.errors = {
          general: error.response?.data?.message || 'Unable to load roles. Showing local role defaults.'
        }
        this.roles = mockRoles
      } finally {
        this.loading = false
      }
    },
    async fetchSingleRole(id) {
      this.loading = true
      this.errors = {}

      try {
        const { data } = await api.get(`/roles/${id}`)
        this.currentRole = normalize(data)
      } catch (error) {
        const role = this.roles.find((item) => String(item.id) === String(id)) || mockRoles.find((item) => String(item.id) === String(id))
        this.currentRole = role ? { ...role, permissions: [...role.permissions] } : null
        if (!role) {
          this.errors = extractErrors(error, 'Role not found.')
        }
      } finally {
        this.loading = false
      }
    },
    async createRole(payload) {
      this.saving = true
      this.errors = {}

      try {
        const { data } = await api.post('/roles', payload)
        const role = normalize(data)
        this.roles.unshift(role)
        return role
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to create role.')
          throw error
        }

        const role = {
          ...payload,
          id: Math.max(0, ...this.roles.map((item) => item.id)) + 1
        }
        this.roles.unshift(role)
        return role
      } finally {
        this.saving = false
      }
    },
    async updateRole(id, payload) {
      this.saving = true
      this.errors = {}

      try {
        const { data } = await api.put(`/roles/${id}`, payload)
        const role = normalize(data)
        const index = this.roles.findIndex((item) => String(item.id) === String(id))
        if (index >= 0) this.roles[index] = role
        this.currentRole = role
        return role
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to update role.')
          throw error
        }

        const role = { ...payload, id: Number(id) }
        const index = this.roles.findIndex((item) => String(item.id) === String(id))
        if (index >= 0) this.roles[index] = role
        this.currentRole = role
        return role
      } finally {
        this.saving = false
      }
    },
    async deleteRole(id) {
      this.deleting = true
      this.errors = {}
      let shouldRemove = false

      try {
        await api.delete(`/roles/${id}`)
        shouldRemove = true
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to delete role.')
          throw error
        }
        shouldRemove = true
      } finally {
        if (shouldRemove) {
          this.roles = this.roles.filter((role) => String(role.id) !== String(id))
          if (String(this.currentRole?.id) === String(id)) {
            this.currentRole = null
          }
        }
        this.deleting = false
      }
    }
  }
})
