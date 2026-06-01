import api from '@/services/api'

export const authService = {
  login: (payload) => api.post('/login', payload),
  register: (payload) => api.post('/register', payload),
  logout: () => api.post('/logout'),
  fetchUser: () => api.get('/user')
}
