import api from '@/services/api'

export const progressService = {
  getCourseProgress: (courseId) => api.get(`/student/progress/${courseId}`),
  completeLesson: (lessonId) => api.post(`/student/lessons/${lessonId}/complete`)
}
