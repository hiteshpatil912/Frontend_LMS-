import api from '@/services/api'

export const adminCourseService = {
  getCourses: (params = {}) => api.get('/admin/courses', { params }),
  approveCourse: (id) => api.patch(`/admin/courses/${id}/approve`),
  rejectCourse: (id) => api.patch(`/admin/courses/${id}/reject`),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`)
}
