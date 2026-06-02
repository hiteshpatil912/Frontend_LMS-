import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'

export function useAuth() {
  const router = useRouter()
  const auth = useAuthStore()

  const login = async (credentials) => {
    const user = await auth.login(credentials)
    const destination = auth.redirectPath

    await router.push(destination)

    return user
  }

  const logout = async () => {
    await auth.logout()
    await router.push('/login')
  }

  const fetchUser = (options) => auth.fetchUser(options)

  return {
    user: computed(() => auth.user),
    token: computed(() => auth.token),
    isAuthenticated: computed(() => auth.isAuthenticated),
    loading: computed(() => auth.loading),
    errors: computed(() => auth.errors),
    login,
    logout,
    fetchUser
  }
}
