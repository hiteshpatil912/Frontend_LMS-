import api from '@/services/api'

export const teacherDashboardService = {
  getDashboard: () => api.get('/teacher/dashboard')
}
