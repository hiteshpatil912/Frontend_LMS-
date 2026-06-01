import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/router/routes/authRoutes'
import { learningRoutes } from '@/router/routes/learningRoutes'
import { publicRoutes } from '@/router/routes/publicRoutes'
import { studentRoutes } from '@/router/routes/studentRoutes'
import { teacherRoutes } from '@/router/routes/teacherRoutes'
import { adminRoutes } from '@/router/routes/adminRoutes'
import { errorRoutes } from '@/router/routes/errorRoutes'
import { useAuthStore } from '@/stores/auth/authStore'

const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  ...adminRoutes,
  ...learningRoutes,
  ...errorRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/courses'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.bootstrapped) {
    try {
      await auth.fetchUser()
    } catch {
      if (to.meta.requiresAuth) {
        return { name: 'login', query: { redirect: to.fullPath } }
      }
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    return { name: 'forbidden' }
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'student.dashboard' }
  }

  return true
})

export default router
