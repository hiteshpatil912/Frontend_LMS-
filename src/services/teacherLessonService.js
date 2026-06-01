import api from '@/services/api'

export const teacherLessonService = {
  getLessons: (courseId) => api.get(`/teacher/courses/${courseId}/lessons`),
  createLesson: (courseId, payload) => api.post(`/teacher/courses/${courseId}/lessons`, payload),
  updateLesson: (id, payload) => api.put(`/teacher/lessons/${id}`, payload),
  deleteLesson: (id) => api.delete(`/teacher/lessons/${id}`)
}
