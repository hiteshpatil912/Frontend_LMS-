import api from '@/services/api'

export const teacherAnalyticsService = {
  getDashboardAnalytics: () => api.get('/teacher/analytics'),
  getCourseAnalytics: (courseId) => api.get(`/teacher/courses/${courseId}/analytics`)
}
