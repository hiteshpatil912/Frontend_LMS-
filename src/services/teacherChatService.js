import api from '@/services/api'

export const teacherChatService = {
  getChats: () => api.get('/teacher/chat'),
  sendMessage: (payload) => api.post('/teacher/chat', payload)
}
