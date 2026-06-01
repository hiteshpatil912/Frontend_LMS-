import api from '@/services/api'

export const notificationService = {
  getNotifications: () => api.get('/my-notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`)
}
