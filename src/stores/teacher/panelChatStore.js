import { defineStore } from 'pinia'
import { teacherChatService } from '@/services/teacherChatService'
import { useAuthStore } from '@/stores/auth/authStore'

const normalizeError = (error, fallback = 'Unable to process chat messages.') => ({
  status: error.response?.status,
  message: error.response?.data?.message || fallback,
  validation: error.response?.data?.errors || {}
})

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const chatListFrom = (response) => {
  const payload = unwrap(response)

  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.chats)) return payload.chats
  if (Array.isArray(payload.data?.chats)) return payload.data.chats
  if (Array.isArray(response?.data?.data?.chats)) return response.data.data.chats

  return []
}

const userName = (user, fallback) => user?.name || user?.email || fallback

const normalizeChat = (chat) => ({
  id: chat.id,
  senderId: chat.sender_id || chat.senderId || chat.sender?.id,
  receiverId: chat.receiver_id || chat.receiverId || chat.receiver?.id,
  senderName: userName(chat.sender, `User #${chat.sender_id || chat.senderId || 'unknown'}`),
  receiverName: userName(chat.receiver, `User #${chat.receiver_id || chat.receiverId || 'unknown'}`),
  message: chat.message || chat.body || '',
  createdAt: chat.created_at || chat.createdAt || '',
  seen_at: chat.seen_at ?? null,   // ⭐ ADD THIS
  mine: false                      // ⭐ optional
})

const groupByParticipant = (items = [], currentUserId) => {
  const groups = {}

  items.forEach((item) => {
    const otherId = String(item.sender_id || item.senderId) === String(currentUserId) 
      ? String(item.receiver_id || item.receiverId) 
      : String(item.sender_id || item.senderId)
      
    if (!groups[otherId]) {
      groups[otherId] = {
        id: otherId,
        otherId,
        name: String(item.sender_id || item.senderId) === String(currentUserId) ? item.receiverName : item.senderName,
        lastMessage: item.message || item.body || '',
        createdAt: item.createdAt,
        raw: [item]
      }
    } else {
      groups[otherId].raw.push(item)
      // keep last message by createdAt
      if (new Date(item.createdAt) > new Date(groups[otherId].createdAt)) {
        groups[otherId].lastMessage = item.message
        groups[otherId].createdAt = item.createdAt
      }
    }
  })

  // convert to array sorted by updated time desc
  return Object.values(groups).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export const useTeacherPanelChatStore = defineStore('teacherPanelChat', {
  state: () => ({
    chats: [],
    loading: false,
    sending: false,
    error: null
  }),

  actions: {
    clearError() {
      this.error = null
    },

    async fetchChats() {
      this.loading = true
      this.clearError()

      try {
        const response = await teacherChatService.getChats()
        const auth = useAuthStore()
        const raw = chatListFrom(response).map(normalizeChat)
        // group conversations by the other participant
        this.chats = groupByParticipant(raw, auth.user?.id)
        return this.chats
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load chat messages.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendMessage(payload) {
      this.sending = true
      this.clearError()

      try {
        const response = await teacherChatService.sendMessage(payload)
        const created = normalizeChat(unwrap(response).chat || unwrap(response))
        // update local grouped conversations without forcing a full refetch
        const auth = useAuthStore()
        const otherId = String(created.senderId) === String(auth.user?.id) ? String(created.receiverId) : String(created.senderId)
        const existing = this.chats.find((c) => String(c.otherId) === String(otherId))
        if (existing) {
          existing.raw = [...existing.raw, created]
          existing.lastMessage = created.message
          existing.createdAt = created.createdAt
        } else {
          this.chats.unshift({ id: otherId, otherId, name: created.senderName === auth.user?.name ? created.receiverName : created.senderName, lastMessage: created.message, createdAt: created.createdAt, raw: [created] })
        }

        return created
      } catch (error) {
        this.error = normalizeError(error, 'Unable to send message.')
        throw error
      } finally {
        this.sending = false
      }
    }
  }
})
