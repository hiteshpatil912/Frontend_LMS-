import api from '@/services/api'

export const teacherAssignmentService = {
  getAssignments: (courseId) => api.get(`/teacher/courses/${courseId}/assignments`),
  createAssignment: (courseId, payload) => api.post(`/teacher/courses/${courseId}/assignments`, payload),
  getAssignment: (id) => api.get(`/teacher/assignments/${id}`),
  updateAssignment: (id, payload) => api.put(`/teacher/assignments/${id}`, payload),
  deleteAssignment: (id) => api.delete(`/teacher/assignments/${id}`)
}
