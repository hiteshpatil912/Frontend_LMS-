import api from '@/services/api'

export const teacherDiscussionService = {
  getDiscussions: (courseId) => api.get(`/teacher/courses/${courseId}/discussions`),
  createDiscussion: (courseId, payload) => api.post(`/teacher/courses/${courseId}/discussions`, payload),
  getDiscussion: (id) => api.get(`/teacher/discussions/${id}`),
  updateDiscussion: (id, payload) => api.put(`/teacher/discussions/${id}`, payload),
  deleteDiscussion: (id) => api.delete(`/teacher/discussions/${id}`)
}
