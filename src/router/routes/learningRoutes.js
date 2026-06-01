export const learningRoutes = [
  {
    path: '/learn/:courseSlug',
    component: () => import('@/layouts/LearningLayout.vue'),
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: '',
        redirect: (to) => `/learn/${to.params.courseSlug}/lessons/intro`
      },
      {
        path: 'lessons/:lessonId',
        name: 'learning.lesson',
        component: () => import('@/pages/learning/LessonPlayer.vue'),
        meta: { title: 'Lesson Player', requiresAuth: true, role: 'student' }
      }
    ]
  }
]
