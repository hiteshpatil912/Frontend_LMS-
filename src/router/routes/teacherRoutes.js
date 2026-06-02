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
        path: 'students',
        name: 'teacher.students',
        component: () => import('@/pages/teacher/Students.vue'),
        meta: { title: 'Teacher Students', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'assignments',
        name: 'teacher.assignments',
        component: () => import('@/pages/teacher/Assignments.vue'),
        meta: { title: 'Teacher Assignments', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'announcements',
        name: 'teacher.announcements',
        component: () => import('@/pages/teacher/Announcements.vue'),
        meta: { title: 'Teacher Announcements', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'chat',
        name: 'teacher.chat',
        component: () => import('@/pages/teacher/Chat.vue'),
        meta: { title: 'Teacher Chat', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'discussions',
        name: 'teacher.discussions',
        component: () => import('@/pages/teacher/Discussions.vue'),
        meta: { title: 'Teacher Discussions', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'quizzes',
        name: 'teacher.quizzes',
        component: () => import('@/pages/teacher/QuizOverview.vue'),
        meta: { title: 'Teacher Quizzes', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'reviews',
        name: 'teacher.reviews',
        component: () => import('@/pages/teacher/Reviews.vue'),
        meta: { title: 'Teacher Reviews', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'resources',
        name: 'teacher.resources',
        component: () => import('@/pages/teacher/Resources.vue'),
        meta: { title: 'Teacher Resources', requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'earnings',
        name: 'teacher.earnings',
        component: () => import('@/pages/teacher/Earnings.vue'),
        meta: { title: 'Teacher Earnings', requiresAuth: true, role: 'teacher' }
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
