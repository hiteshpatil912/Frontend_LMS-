import api from '@/services/api'

export const teacherCourseService = {
  getCourses: (params = {}) => api.get('/teacher/courses', { params }),
  createCourse: (payload) => api.post('/teacher/courses', payload),
  updateCourse: (id, payload) => api.put(`/teacher/courses/${id}`, payload),
  deleteCourse: (id) => api.delete(`/teacher/courses/${id}`)
}
