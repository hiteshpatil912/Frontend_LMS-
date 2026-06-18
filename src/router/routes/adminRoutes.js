export const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: () => import('@/pages/admin/Dashboard.vue'),
        meta: { title: 'Admin Dashboard', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'users',
        name: 'admin.users',
        component: () => import('@/pages/admin/Users.vue'),
        meta: { title: 'Admin Users', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'courses',
        name: 'admin.courses',
        component: () => import('@/pages/admin/Courses.vue'),
        meta: { title: 'Admin Courses', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'lessons',
        name: 'admin.lessons',
        component: () => import('@/pages/admin/Lessons.vue'),
        meta: { title: 'Admin Lessons', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'quizzes',
        name: 'admin.quizzes',
        component: () => import('@/pages/admin/Quizzes.vue'),
        meta: { title: 'Admin Quizzes', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'orders',
        name: 'admin.orders',
        component: () => import('@/pages/admin/Orders.vue'),
        meta: { title: 'Admin Orders', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'reviews',
        name: 'admin.reviews',
        component: () => import('@/pages/admin/Reviews.vue'),
        meta: { title: 'Admin Reviews', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'reports',
        name: 'admin.reports',
        component: () => import('@/pages/admin/Reports.vue'),
        meta: { title: 'Admin Reports', requiresAuth: true, role: 'admin' }
      }
    ]
  }
]
