import api from '@/services/api'

export const adminDashboardService = {
  getDashboard: () => api.get('/admin/dashboard')
}
