export const publicRoutes = [
  {
    path: '/',
    component: () => import('@/layouts/GuestLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/courses'
      },
      {
        path: 'courses',
        name: 'courses.index',
        component: () => import('@/pages/courses/CourseList.vue'),
        meta: { title: 'Courses' }
      },
      {
        path: 'courses/:id',
        name: 'courses.show',
        component: () => import('@/pages/courses/CourseDetails.vue'),
        meta: { title: 'Course Details', requiresAuth: true, role: 'student' }
      }
    ]
  }
]
