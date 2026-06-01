import { defineStore } from 'pinia'
import api from '@/plugins/axios'



const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useChatStore = defineStore('chat', {
  state: () => ({

  chats: [],

  discussionRooms: [],

  activeChat: null,

  unreadMessages: 0,

  loading: false,

  saving: false,

  errors: {}

}),
  getters: {
    items: (state) => state.chats,
    directChats: (state) => state.chats.filter((chat) => chat.type === 'direct'),
    courseDiscussions: (state) => state.discussionRooms,
    unreadTotal: (state) =>  (state.chats || []).reduce(
    (total, chat) =>
      total + (chat.unread || 0),
    0
  ),
  },
  actions: {
    async fetchChats(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/chat', { params })
        const result = normalize(data)
        this.chats = result.chats || result
        this.discussionRooms = result.discussionRooms || this.discussionRooms
      } catch (error) {
        this.errors = { general: 'Unable to sync chats. Showing local messages.' }
      } finally {
        this.unreadMessages = this.unreadTotal
        this.loading = false
      }
    },
    setActiveChat(chat) {
      this.activeChat = chat
      this.chats = this.chats.map((item) => (String(item.id) === String(chat.id) ? { ...item, unread: 0 } : item))
      this.unreadMessages = this.unreadTotal
    },
    async createDiscussionRoom(payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.post('/student/chat/discussions', payload)
        const room = normalize(data)
        this.discussionRooms.unshift(room)
        return room
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = error.response?.data?.errors || { general: error.response?.data?.message || 'Unable to create discussion room.' }
          throw error
        }
        const room = { ...payload, id: Date.now(), participants: 0, unread: 0, online: 0, lastMessage: 'Discussion room created.' }
        this.discussionRooms.unshift(room)
        return room
      } finally {
        this.saving = false
      }
    },
    receiveRealtimeMessage(chatId, message) {
      this.chats = this.chats.map((chat) =>
        String(chat.id) === String(chatId)
          ? { ...chat, lastMessage: message.body, unread: this.activeChat?.id === chat.id ? chat.unread : Number(chat.unread || 0) + 1, updatedAt: message.createdAt }
          : chat
      )
      this.unreadMessages = this.unreadTotal
    },
    setTyping(chatId, typing = true) {
      this.chats = this.chats.map((chat) => (String(chat.id) === String(chatId) ? { ...chat, typing } : chat))
    }
  }
})
