<template>
  <section class="flex min-h-[680px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
    <EmptyChatState v-if="!chat" class="m-4 flex-1" />
    <template v-else>
      <header class="flex items-center justify-between border-b border-slate-200 bg-white p-4">
        <div class="flex items-center gap-3">
          <div class="grid size-10 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">{{ chat.avatar }}</div>
          <div>
            <h2 class="text-base font-semibold text-slate-950">{{ chat.name }}</h2>
            <div class="mt-1 flex items-center gap-2">
              <OnlineStatusBadge :online="chat.online" />
              <TypingIndicator :show="chat.typing" />
            </div>
          </div>
        </div>
      </header>
      <div class="flex-1 space-y-3 overflow-y-auto p-4">
        <div v-if="loading" class="space-y-3">
          <div v-for="item in 5" :key="item" class="h-16 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
        <MessageBubble v-for="message in messages" v-else :key="message.id" :message="message" />
      </div>
      <ChatInput :loading="sending" @send="$emit('send', $event)" />
    </template>
  </section>
</template>

<script setup>
import ChatInput from '@/components/chat/ChatInput.vue'
import EmptyChatState from '@/components/chat/EmptyChatState.vue'
import MessageBubble from '@/components/chat/MessageBubble.vue'
import OnlineStatusBadge from '@/components/chat/OnlineStatusBadge.vue'
import TypingIndicator from '@/components/chat/TypingIndicator.vue'

defineProps({
  chat: { type: Object, default: null },
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  sending: { type: Boolean, default: false }
})

defineEmits(['send'])
</script>
