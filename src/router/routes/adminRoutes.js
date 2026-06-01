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
      }
    ]
  }
]
