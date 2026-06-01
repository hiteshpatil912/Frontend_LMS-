import api from '@/services/api'

export const myCoursesService = {
  getMyCourses: (params = {}) => api.get('/student/my-courses', { params })
}
