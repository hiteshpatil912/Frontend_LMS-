export const studentRoutes = [
  {
    path: '/student',
    component: () => import('@/layouts/StudentLayout.vue'),
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: '',
        redirect: '/student/dashboard'
      },
      {
        path: 'dashboard',
        name: 'student.dashboard',
        component: () => import('@/pages/student/Dashboard.vue'),
        meta: { title: 'Dashboard', requiresAuth: true, role: 'student' }
      },
      {
        path: 'my-courses',
        name: 'student.my-courses',
        component: () => import('@/pages/student/MyCourses.vue'),
        meta: { title: 'My Courses', requiresAuth: true, role: 'student' }
      },
      {
        path: 'wishlist',
        name: 'student.wishlist',
        component: () => import('@/pages/student/Wishlist.vue'),
        meta: { title: 'Wishlist', requiresAuth: true, role: 'student' }
      },
      {
        path: 'notifications',
        name: 'student.notifications',
        component: () => import('@/pages/student/Notifications.vue'),
        meta: { title: 'Notifications', requiresAuth: true, role: 'student' }
      },
      {
        path: 'profile',
        name: 'student.profile',
        component: () => import('@/pages/student/Profile.vue'),
        meta: { title: 'Profile', requiresAuth: true, role: 'student' }
      },
      {
        path: 'chat',
        name: 'student.chat',
        component: () => import('@/pages/student/Chat.vue'),
        meta: { title: 'Chat', requiresAuth: true, role: 'student' }
      },
      {
        path: 'quizzes',
        name: 'student.quizzes',
        component: () => import('@/pages/student/QuizList.vue'),
        meta: { title: 'Quizzes', requiresAuth: true, role: 'student' }
      },
      {
        path: 'quiz/:id/attempt',
        name: 'student.quiz.attempt',
        component: () => import('@/pages/student/QuizAttempt.vue'),
        meta: { title: 'Quiz Attempt', requiresAuth: true, role: 'student' }
      },
      {
        path: 'quiz/:id/result',
        name: 'student.quiz.result',
        component: () => import('@/pages/student/QuizResult.vue'),
        meta: { title: 'Quiz Result', requiresAuth: true, role: 'student' }
      },
      {
        path: 'certificates',
        name: 'student.certificates',
        component: () => import('@/pages/student/Certificates.vue'),
        meta: { title: 'Certificates', requiresAuth: true, role: 'student' }
      },
      {
        path: 'certificates/:id',
        name: 'student.certificates.show',
        component: () => import('@/pages/student/CertificateDetails.vue'),
        meta: { title: 'Certificate Details', requiresAuth: true, role: 'student' }
      }
    ]
  }
]
