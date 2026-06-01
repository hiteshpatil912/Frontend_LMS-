import api from '@/services/api'

export const dashboardService = {
  getStudentDashboard: () => api.get('/student/dashboard')
}
