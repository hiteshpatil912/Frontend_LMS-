import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth/authStore'

export const permissionCatalog = [
  'manage_users',
  'manage_roles',
  'manage_courses',
  'manage_students',
  'manage_teachers',
  'manage_payments',
  'view_analytics',
  'manage_settings'
]

const normalize = (data) => data.data || data

export const useAdminPermissionsStore = defineStore('adminPermissions', {
  state: () => ({
    permissions: permissionCatalog,
    rolePermissions: {
      Admin: [...permissionCatalog],
      Teacher: ['manage_courses', 'manage_students'],
      Student: ['view_courses']
    },
    loading: false,
    saving: false,
    errors: {}
  }),
  getters: {
    groupedPermissions: (state) => ({
      users: state.permissions.filter((permission) => permission.includes('users') || permission.includes('students') || permission.includes('teachers')),
      courses: state.permissions.filter((permission) => permission.includes('courses')),
      platform: state.permissions.filter((permission) => permission.includes('roles') || permission.includes('settings')),
      reporting: state.permissions.filter((permission) => permission.includes('analytics') || permission.includes('payments'))
    })
  },
  actions: {
    async fetchPermissions() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/admin/permissions')
        const payload = normalize(data)
        this.permissions = payload.permissions || payload
        this.rolePermissions = payload.rolePermissions || this.rolePermissions
      } catch (error) {
        this.errors = {
          general: error.response?.data?.message || 'Unable to sync permissions. Showing local RBAC defaults.'
        }
      } finally {
        this.loading = false
      }
    },
    checkPermission(permission) {
      const auth = useAuthStore()
      return auth.hasPermission(permission)
    },
    async assignPermissions(roleName, permissions) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.post('/admin/permissions/assign', {
          role: roleName,
          permissions
        })
        const payload = normalize(data)
        this.rolePermissions[roleName] = payload.permissions || permissions
        return this.rolePermissions[roleName]
      } catch (error) {
        if (error.response && ![404, 405].includes(error.response.status)) {
          this.errors = {
            general: error.response.data?.message || 'Unable to assign permissions.'
          }
          throw error
        }

        this.rolePermissions[roleName] = permissions
        return permissions
      } finally {
        this.saving = false
      }
    }
  }
})
