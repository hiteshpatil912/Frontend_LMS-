import api from '@/services/api'

export const adminUserService = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  toggleUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status })
}
