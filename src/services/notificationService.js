import api from '@/services/api'

export const notificationService = {
  list: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all')
}
