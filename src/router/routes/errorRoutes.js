export const errorRoutes = [
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/pages/errors/Forbidden.vue'),
    meta: { title: 'Access Denied' }
  }
]
