export const authRoutes = [
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { guest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/Login.vue'),
        meta: { title: 'Login', guest: true }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/auth/Register.vue'),
        meta: { title: 'Register', guest: true }
      }
    ]
  }
]
