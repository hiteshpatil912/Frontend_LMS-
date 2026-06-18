<template>
  <aside class="h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-200 p-4">
      <h2 class="text-base font-semibold text-slate-950">Messages</h2>
      <p class="mt-1 text-sm text-slate-500">{{ unreadTotal }} unread messages</p>
    </div>
    <div v-if="loading" class="space-y-2 p-3">
      <div v-for="item in 5" :key="item" class="h-16 animate-pulse rounded-lg bg-slate-100"></div>
    </div>
    <div v-else class="max-h-[640px] overflow-y-auto p-2">
      <button v-for="chat in chats" :key="chat.id" class="w-full rounded-lg p-3 text-left hover:bg-slate-50" :class="activeId === chat.id ? 'bg-brand-50' : ''" type="button" @click="$emit('select', chat)">
        <div class="flex gap-3">
          <div class="grid size-10 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">{{ (chat.name || "?").charAt(0).toUpperCase() }}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p class="truncate text-sm font-semibold text-slate-950">{{ chat.name }}</p>
              <span v-if="chat.unread" class="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">{{ chat.unread }}</span>
            </div>
            <p class="mt-1 truncate text-xs text-slate-500">{{ chat.lastMessage }}</p>
            <div class="mt-2 flex items-center gap-2">
              <OnlineStatusBadge :online="chat.online" />
              <TypingIndicator :show="chat.typing" />
            </div>
          </div>
        </div>
      </button>
    </div>
  </aside>
</template>

<script setup>
import OnlineStatusBadge from '@/components/chat/OnlineStatusBadge.vue'
import TypingIndicator from '@/components/chat/TypingIndicator.vue'

defineProps({
  chats: { type: Array, default: () => [] },
  activeId: { type: [Number, String], default: null },
  unreadTotal: { type: Number, default: 0 },
  loading: { type: Boolean, default: false }
})

defineEmits(['select'])
</script>
