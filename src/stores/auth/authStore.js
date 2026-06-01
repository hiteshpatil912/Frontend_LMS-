import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const roleHome = {
  student: '/student/dashboard'
}

const safelyParseJson = (value) => {
  try {
    return value ? JSON.parse(value) : null
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

const normalizeAuthPayload = (response) => {
  const payload = response?.data?.data || response?.data || response

  return {
    token: payload?.token || null,
    user: payload?.user || null
  }
}

const normalizeUserPayload = (response) => {
  const payload = response?.data?.data || response?.data || response

  return payload?.user || payload || null
}

const normalizeErrors = (error) => {
  const status = error.response?.status
  const data = error.response?.data

  if (status === 422 && data?.errors) {
    return data.errors
  }

  if (status === 401) {
    return { general: 'Invalid email or password.' }
  }

  if (status === 403) {
    return { general: 'You do not have permission to perform this action.' }
  }

  return {
    general: data?.message || error.message || 'Something went wrong. Please try again.'
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY),
    user: safelyParseJson(localStorage.getItem(USER_KEY)),
    bootstrapped: false,
    loading: false,
    errors: {}
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    role: (state) => state.user?.role || null,
    isStudent: (state) => state.user?.role === 'student',
    redirectPath: (state) => roleHome[state.user?.role] || '/student/dashboard'
  },

  actions: {
    clearErrors() {
      this.errors = {}
    },

    setSession({ token, user }) {
      this.token = token
      this.user = user

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    clearSession() {
      this.token = null
      this.user = null
      this.bootstrapped = true
      this.errors = {}

      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },

    async login(credentials) {
      this.loading = true
      this.clearErrors()

      try {
        const response = await authService.login(credentials)
        const session = normalizeAuthPayload(response)

        if (!session.token || !session.user) {
          throw new Error('Login response did not include a token and user.')
        }

        this.setSession(session)

        return session.user
      } catch (error) {
        this.errors = normalizeErrors(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser({ force = false } = {}) {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser = safelyParseJson(localStorage.getItem(USER_KEY))

      if (!storedToken) {
        this.clearSession()
        this.bootstrapped = true
        return null
      }

      this.token = storedToken

      if (storedUser && !force) {
        this.user = storedUser
        this.bootstrapped = true
        return this.user
      }

      try {
        const response = await authService.fetchUser()
        const user = normalizeUserPayload(response)

        if (!user) {
          throw new Error('User response was empty.')
        }

        this.user = user
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        this.bootstrapped = true

        return this.user
      } catch (error) {
        this.clearSession()
        throw error
      }
    },

    async logout() {
      try {
        if (this.token) {
          await authService.logout()
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error(error)
        }
      } finally {
        this.clearSession()
      }
    }
  }
})
