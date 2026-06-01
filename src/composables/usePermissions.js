import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth/authStore'

export function usePermissions() {
  const auth = useAuthStore()

  const permissions = computed(() => auth.permissions)

  const hasPermission = (permission) => auth.hasPermission(permission)
  const hasRole = (role) => auth.role === role
  const canAccess = ({ role, permission } = {}) => {
    const roleAllowed = !role || hasRole(role)
    const permissionAllowed = !permission || hasPermission(permission)
    return roleAllowed && permissionAllowed
  }

  return {
    permissions,
    hasPermission,
    hasRole,
    canAccess
  }
}
