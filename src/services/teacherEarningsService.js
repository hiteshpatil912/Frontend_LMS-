import api from '@/services/api'

export const teacherEarningsService = {
  getEarnings: () => api.get('/teacher/earnings')
}
