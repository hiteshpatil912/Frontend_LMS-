<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">{{ roleLabel }}</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Live Chat</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Direct messages, course conversations, unread state, and realtime-ready messaging.</p>
    </div>

    <div class="grid gap-5 xl:grid-cols-[360px_1fr]">
      <ChatSidebar :chats="chatStore.chats" :active-id="chatStore.activeChat?.id" :unread-total="chatStore.unreadTotal" :loading="chatStore.loading" @select="selectChat" />
      <ChatWindow :chat="chatStore.activeChat" :messages="activeMessages" :loading="messageStore.loading" :sending="messageStore.sending" @send="sendMessage" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'
import { useChatStore } from '@/stores/shared/chatStore'
import { useMessageStore } from '@/stores/shared/messageStore'

const props = defineProps({ role: { type: String, default: 'student' } })
const chatStore = useChatStore()
const messageStore = useMessageStore()

const roleLabel = computed(() => (props.role === 'admin' ? 'Chat monitoring' : props.role === 'teacher' ? 'Teacher messaging' : 'Student messaging'))
const activeMessages = computed(() => (chatStore.activeChat ? messageStore.messagesForChat(chatStore.activeChat.id) : []))

const selectChat = async (chat) => {
  chatStore.setActiveChat(chat)
  await messageStore.fetchMessages(chat.id)
}

const sendMessage = async (payload) => {
  if (!chatStore.activeChat) return
  const message = await messageStore.sendMessage(chatStore.activeChat.id, payload)
  chatStore.receiveRealtimeMessage(chatStore.activeChat.id, message)
}

onMounted(async () => {
  await chatStore.fetchChats({ role: props.role })
  if (!chatStore.activeChat && chatStore.chats.length) await selectChat(chatStore.chats[0])
})
</script>
