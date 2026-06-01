import api from '@/services/api'

export const orderService = {
  list: () => api.get('/orders'),
  create: (payload) => api.post('/orders', payload),
  show: (orderId) => api.get(`/orders/${orderId}`)
}
