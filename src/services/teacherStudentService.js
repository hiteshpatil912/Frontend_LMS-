import api from '@/services/api'

export const teacherStudentService = {
  getStudents: () => api.get('/teacher/students'),
  getStudent: (id) => api.get(`/teacher/students/${id}`)
}
