import api from '@/services/api'

export const progressService = {
  getCourseProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
  completeLesson: (lessonId) => api.post(`/lessons/${lessonId}/complete`)
}
