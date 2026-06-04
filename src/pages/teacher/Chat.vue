<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Chat</h1>
      <p class="mt-1 text-sm text-slate-500">Review learner conversations and respond to course questions.</p>
    </div>

    <div class="grid min-h-[620px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
      <aside class="border-b border-slate-200 lg:border-b-0 lg:border-r">
        <div class="border-b border-slate-100 p-4">
          <h2 class="text-sm font-semibold text-slate-950">Conversations</h2>
          <p class="mt-1 text-xs text-slate-500">{{ conversations.length }} active threads</p>
        </div>

        <div v-if="conversations.length" class="divide-y divide-slate-100">
          <button
            v-for="conversation in conversations"
            :key="conversation.id"
            type="button"
            class="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-slate-50"
            :class="selectedConversation?.id === conversation.id ? 'bg-brand-50' : ''"
            @click="selectedConversationId = conversation.id"
          >
            <div class="grid size-10 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {{ initials(conversation.name) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-slate-950">{{ conversation.name }}</p>
                  <p class="mt-0.5 text-xs text-slate-500">{{ conversation.role }}</p>
                </div>
                <span
                  v-if="conversation.unread"
                  class="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white"
                >
                  {{ conversation.unread }}
                </span>
              </div>
              <p class="mt-2 truncate text-sm text-slate-500">{{ conversation.lastMessage }}</p>
            </div>
          </button>
        </div>

        <div v-else class="p-6 text-center text-sm text-slate-500">
          No conversations found.
        </div>
      </aside>

      <div v-if="selectedConversation" class="flex min-h-[620px] flex-col">
        <header class="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div class="min-w-0">
            <h2 class="truncate text-base font-semibold text-slate-950">{{ selectedConversation.name }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ selectedConversation.course }}</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Online</span>
        </header>

        <div class="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
          <div
            v-for="message in selectedMessages"
            :key="message.id"
            class="flex"
            :class="message.mine ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-sm sm:max-w-[70%]"
              :class="message.mine ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-700'"
            >
              <p>{{ message.body }}</p>
              <p class="mt-2 text-xs" :class="message.mine ? 'text-brand-100' : 'text-slate-400'">{{ message.time }}</p>
            </div>
          </div>
        </div>

        <form class="border-t border-slate-100 p-4" @submit.prevent="sendMessage">
          <div class="flex flex-col gap-3 sm:flex-row">
            <input
              v-model.trim="draftMessage"
              class="focus-ring min-h-11 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Write a message"
              type="text"
            />
            <button
              type="submit"
              class="focus-ring rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!draftMessage"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      <div v-else class="flex min-h-[420px] items-center justify-center p-8 text-center text-sm text-slate-500">
        Select a conversation to start chatting.
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const conversations = [
  {
    id: 1,
    name: 'Aarav Khan',
    role: 'Student',
    course: 'Vue Foundations',
    lastMessage: 'Can you review my component structure?',
    unread: 2
  },
  {
    id: 2,
    name: 'Mina Patel',
    role: 'Student',
    course: 'Laravel API LMS',
    lastMessage: 'The API token flow makes sense now.',
    unread: 0
  },
  {
    id: 3,
    name: 'Riya Das',
    role: 'Student',
    course: 'Pinia State Management',
    lastMessage: 'I submitted the store refactor exercise.',
    unread: 1
  }
]

const messages = {
  1: [
    { id: 1, body: 'Can you review my component structure?', time: '09:20 AM', mine: false },
    { id: 2, body: 'Sure. Share the part where props are passed into the child component.', time: '09:24 AM', mine: true },
    { id: 3, body: 'I pushed the latest version in the assignment comments.', time: '09:28 AM', mine: false }
  ],
  2: [
    { id: 1, body: 'The API token flow makes sense now.', time: 'Yesterday', mine: false },
    { id: 2, body: 'Great. Next, check how the interceptor attaches the bearer token.', time: 'Yesterday', mine: true }
  ],
  3: [
    { id: 1, body: 'I submitted the store refactor exercise.', time: '08:45 AM', mine: false },
    { id: 2, body: 'Thanks. I will review it before the live session.', time: '08:51 AM', mine: true }
  ]
}

const selectedConversationId = ref(conversations[0]?.id || null)
const draftMessage = ref('')

const selectedConversation = computed(() =>
  conversations.find((conversation) => conversation.id === selectedConversationId.value) || null
)

const selectedMessages = computed(() => messages[selectedConversationId.value] || [])

const initials = (name) =>
  String(name || 'User')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const sendMessage = () => {
  draftMessage.value = ''
}
</script>
