export const teacherRoutes = [
  {
    path: '/teacher',
    component: () => import('@/layouts/TeacherLayout.vue'),
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      {
        path: '',
        redirect: '/teacher/dashboard'
      },
      {
        path: 'dashboard',
        name: 'teacher.dashboard',
        component: () => import('@/pages/teacher/Dashboard.vue'),
        meta: { title: 'Teacher Dashboard', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'courses',
        name: 'teacher.courses',
        component: () => import('@/pages/teacher/MyCourses.vue'),
        meta: { title: 'Teacher Courses', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'courses/:id/lessons',
        name: 'teacher.courses.lessons',
        component: () => import('@/pages/teacher/Lessons.vue'),
        meta: { title: 'Teacher Lessons', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'lessons/:id/quizzes',
        name: 'teacher.lessons.quizzes',
        component: () => import('@/pages/teacher/Quizzes.vue'),
        meta: { title: 'Teacher Quizzes', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'quizzes/:id/questions',
        name: 'teacher.quizzes.questions',
        component: () => import('@/pages/teacher/Questions.vue'),
        meta: { title: 'Teacher Questions', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'analytics',
        name: 'teacher.analytics',
        component: () => import('@/pages/teacher/Analytics.vue'),
        meta: { title: 'Teacher Analytics', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'admin/courses',
        name: 'teacher.admin.courses',
        component: () => import('@/pages/teacher/MyCourses.vue'),
        meta: { title: 'Teacher Courses', requiresAuth: true, role: 'teacher' }
      }
    ]
  }
]
