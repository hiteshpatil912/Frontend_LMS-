import { defineStore } from 'pinia'
import { adminUserService } from '@/services/adminUserService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process admin users.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to manage users.',
    404: 'User data was not found.',
    422: 'Please check the user fields.',
    500: 'The server could not process users right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback,
    validation: error.response?.data?.errors || {}
  }
}

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name || 'Unnamed User',
  email: user.email || 'No email',
  role: user.role || 'student',
  status: user.status || (user.is_active === false ? 'inactive' : 'active')
})

export const useAdminPanelUserStore = defineStore('adminPanelUsers', {
  state: () => ({
    users: [],
    activeUser: null,
    loading: false,
    savingId: null,
    error: null
  }),

  getters: {
    hasUsers: (state) => state.users.length > 0
  },

  actions: {
    clearError() {
      this.error = null
    },

    async fetchUsers(params = {}) {
      this.loading = true
      this.clearError()

      try {
        const response = await adminUserService.getUsers(params)
        const payload = unwrap(response)
        const users = Array.isArray(payload) ? payload : payload.users || payload.data || []
        this.users = users.map(normalizeUser)
        return this.users
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load users.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser(id) {
      this.loading = true
      this.clearError()

      try {
        const response = await adminUserService.getUser(id)
        this.activeUser = normalizeUser(unwrap(response).user || unwrap(response))
        return this.activeUser
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load user details.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserRole(id, role) {
      this.savingId = id
      this.clearError()

      try {
        const response = await adminUserService.updateUserRole(id, role)
        const user = normalizeUser(unwrap(response).user || unwrap(response))
        this.replaceUser(user)
        return user
      } catch (error) {
        this.error = normalizeError(error, 'Unable to update user role.')
        throw error
      } finally {
        this.savingId = null
      }
    },

    async toggleUserStatus(id, status) {
      this.savingId = id
      this.clearError()

      try {
        const response = await adminUserService.toggleUserStatus(id, status)
        const user = normalizeUser(unwrap(response).user || unwrap(response))
        this.replaceUser(user)
        return user
      } catch (error) {
        this.error = normalizeError(error, 'Unable to update user status.')
        throw error
      } finally {
        this.savingId = null
      }
    },

    replaceUser(user) {
      const index = this.users.findIndex((item) => String(item.id) === String(user.id))

      if (index >= 0) {
        this.users.splice(index, 1, user)
      }

      if (String(this.activeUser?.id) === String(user.id)) {
        this.activeUser = user
      }
    }
  }
})
