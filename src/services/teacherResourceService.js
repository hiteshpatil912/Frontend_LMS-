import api from '@/services/api'

export const teacherResourceService = {
  getResources: () => api.get('/teacher/resources'),

  createResource: (courseId, payload) =>
    api.post(`/teacher/courses/${courseId}/resources`, payload),

  updateResource: (id, payload) =>
    api.put(`/teacher/resources/${id}`, payload),

  deleteResource: (id) =>
    api.delete(`/teacher/resources/${id}`)
}