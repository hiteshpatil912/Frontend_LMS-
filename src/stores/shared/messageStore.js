import { defineStore } from 'pinia'
import api from '@/plugins/axios'

const mockMessages = {
  1: [
    { id: 1, chatId: 1, senderId: 'teacher-1', senderName: 'Mina Patel', body: 'How is your research plan coming along?', createdAt: '2026-05-19T09:55:00.000Z', read: true, mine: false },
    { id: 2, chatId: 1, senderId: 'me', senderName: 'You', body: 'I drafted the interview guide and need feedback.', createdAt: '2026-05-19T10:02:00.000Z', read: true, mine: true },
    { id: 3, chatId: 1, senderId: 'teacher-1', senderName: 'Mina Patel', body: 'Send it here. I will mark up the question flow.', createdAt: '2026-05-19T10:20:00.000Z', read: false, mine: false }
  ],
  2: [
    { id: 4, chatId: 2, senderId: 'teacher-2', senderName: 'Aisha Rahman', body: 'Your dashboard exercise looks good.', createdAt: '2026-05-18T15:40:00.000Z', read: true, mine: false }
  ],
  3: [
    { id: 5, chatId: 3, senderId: 'admin', senderName: 'Admin', body: 'Welcome to the spring learning cohort.', createdAt: '2026-05-18T08:00:00.000Z', read: false, mine: false }
  ]
}

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useMessageStore = defineStore('messages', {
  state: () => ({
    messages: {},
    loading: false,
    sending: false,
    errors: {}
  }),
  getters: {
    messagesForChat: (state) => (chatId) => state.messages[chatId] || []
  },
  actions: {
    async fetchMessages(chatId) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/chat/${chatId}/messages`)
        this.messages[chatId] = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync messages. Showing local chat history.' }
        this.messages[chatId] = mockMessages[chatId] || []
      } finally {
        this.loading = false
      }
    },
    async sendMessage(chatId, payload) {
      this.sending = true
      this.errors = {}
      try {
        const { data } = await api.post(`/chat/${chatId}/messages`, payload)
        const message = normalize(data)
        this.messages[chatId] = [...(this.messages[chatId] || []), message]
        return message
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to send message.' }
          throw error
        }
        const message = {
          id: Date.now(),
          chatId,
          senderId: 'me',
          senderName: 'You',
          body: payload.body,
          attachmentName: payload.attachmentName || '',
          emoji: payload.emoji || '',
          createdAt: new Date().toISOString(),
          read: true,
          mine: true
        }
        this.messages[chatId] = [...(this.messages[chatId] || []), message]
        return message
      } finally {
        this.sending = false
      }
    },
    async markMessageRead(chatId, messageId) {
      try {
        await api.patch(`/chat/${chatId}/messages/${messageId}/read`)
      } catch {
        // Local fallback keeps the UI responsive and websocket-ready.
      } finally {
        this.messages[chatId] = (this.messages[chatId] || []).map((message) => (String(message.id) === String(messageId) ? { ...message, read: true } : message))
      }
    }
  }
})
