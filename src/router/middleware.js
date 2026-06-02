const roleHome = {
  admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard'
}

export async function authMiddleware(to, auth) {

  if (!auth.bootstrapped) {

    try {

      await auth.fetchUser()

    } catch (error) {

      console.error(error)

    }

  }

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !auth.isAuthenticated
  ) {

    if (to.name !== 'login') {

      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }

    }

  }

  return true

}

export function guestMiddleware(to, auth) {

  if (
    to.matched.some((record) => record.meta.guest) &&
    auth.isAuthenticated
  ) {

    return roleHome[auth.role] || '/login'

  }

  return true

}

export function roleMiddleware() {

  return true

}

export function permissionMiddleware() {

  return true

}

export { roleHome }
