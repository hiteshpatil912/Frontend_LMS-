import api from '@/services/api'

export const teacherAnnouncementService = {
  getAnnouncements: (courseId) => api.get(`/teacher/courses/${courseId}/announcements`),
  createAnnouncement: (courseId, payload) => api.post(`/teacher/courses/${courseId}/announcements`, payload),
  getAnnouncement: (id) => api.get(`/teacher/announcements/${id}`),
  updateAnnouncement: (id, payload) => api.put(`/teacher/announcements/${id}`, payload),
  deleteAnnouncement: (id) => api.delete(`/teacher/announcements/${id}`)
}
