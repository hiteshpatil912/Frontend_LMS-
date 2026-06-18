<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Chat</h1>
      <p class="mt-1 text-sm text-slate-500">
        Review learner conversations and respond to course questions.
      </p>
    </div>

    <div
      v-if="chat.error"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ chat.error.message }}
    </div>

    <div
      class="grid min-h-[620px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]"
    >
      <aside class="border-b border-slate-200 lg:border-b-0 lg:border-r">
        <div class="border-b border-slate-100 p-4">
          <h2 class="text-sm font-semibold text-slate-950">Conversations</h2>
          <p class="mt-1 text-xs text-slate-500">{{ chat.chats.length }} conversations</p>
        </div>

        <div v-if="chat.loading" class="space-y-3 p-4">
          <div
            v-for="item in 5"
            :key="item"
            class="h-16 animate-pulse rounded-lg bg-slate-100"
          ></div>
        </div>

        <div
          v-else-if="chat.chats.length"
          class="max-h-[560px] divide-y divide-slate-100 overflow-y-auto"
        >
          <button
            v-for="convo in chat.chats"
            :key="convo.id"
            type="button"
            class="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-slate-50"
            :class="selectedChat?.id === convo.id ? 'bg-brand-50' : ''"
            @click="selectedChatId = convo.id"
          >
            <div
              class="grid size-10 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white"
            >
              {{ initials(convo.name) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-slate-950">
                    {{ convo.name }}
                  </p>
                  <p class="mt-0.5 truncate text-xs text-slate-500">
                    {{ convo.lastMessage }}
                  </p>
                </div>
                <span class="shrink-0 text-xs text-slate-400">{{
                  formatDate(convo.createdAt)
                }}</span>
              </div>
            </div>
          </button>
        </div>

        <div v-else class="p-6 text-center text-sm text-slate-500">
          No chat messages found.
        </div>
      </aside>

      <div class="flex min-h-[620px] flex-col">
        <header
          class="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4"
        >
          <div class="min-w-0">
            <h2 class="truncate text-base font-semibold text-slate-950">
              {{ selectedChat ? selectedChat.name : "New message" }}
            </h2>
            <p class="mt-1 text-sm text-slate-500">
              {{
                selectedChat
                  ? `Conversation with ${selectedChat.name}`
                  : "Select a conversation to begin."
              }}
            </p>
          </div>
          <button
            type="button"
            class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="chat.loading"
            @click="loadChats"
          >
            Refresh
          </button>
        </header>

        <div class="flex-1 overflow-y-auto bg-slate-50 p-5">
          <div v-if="selectedChat" class="space-y-4">
            <div
              v-for="msg in sortedMessages"
              :key="msg.id"
              class="flex"
              :class="
                String(msg.sender_id || msg.senderId || msg.sender?.id) === currentUserId
                  ? 'justify-end'
                  : 'justify-start'
              "
            >
              <div
                class="max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-sm sm:max-w-[70%]"
                :class="
                  String(msg.sender_id || msg.senderId || msg.sender?.id) ===
                  currentUserId
                    ? 'bg-brand-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700'
                "
              >
                <p class="whitespace-pre-line">{{ msg.message || msg.body }}</p>
                <p
                  class="mt-2 flex items-center justify-end gap-1 text-xs"
                  :class="
                    String(msg.sender_id || msg.senderId || msg.sender?.id) ===
                    currentUserId
                      ? 'text-brand-100'
                      : 'text-slate-400'
                  "
                >
                  {{ formatDateTime(msg.created_at || msg.createdAt) }}

                  <span
                    v-if="
                      String(msg.sender_id || msg.senderId || msg.sender?.id) ===
                      currentUserId
                    "
                  >
                    {{ msg.seen_at ? "✓✓" : "✓" }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            v-else
            class="flex h-full min-h-[320px] items-center justify-center text-center text-sm text-slate-500"
          >
            Select a conversation to view messages.
          </div>
        </div>

        <form class="border-t border-slate-100 p-4" @submit.prevent="sendMessage">
          <div class="grid gap-3 lg:grid-cols-[1fr_auto]">
            <label class="block">
              <span class="sr-only">Message</span>
              <textarea
                v-model.trim="form.message"
                class="focus-ring min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Write a message"
                rows="1"
              ></textarea>
              <p v-if="fieldError('message')" class="mt-1 text-sm text-rose-600">
                {{ fieldError("message") }}
              </p>
            </label>

            <button
              type="submit"
              class="focus-ring rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="chat.sending || !selectedChat || !form.message"
            >
              {{
                chat.sending
                  ? "Sending..."
                  : selectedChat
                  ? "Send"
                  : "Select a conversation"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useTeacherPanelChatStore } from "@/stores/teacher/panelChatStore";
import { useAuthStore } from "@/stores/auth/authStore";
import api from "@/services/api";

const chat = useTeacherPanelChatStore();
const selectedChatId = ref(null);
const form = reactive({
  message: "",
});

const auth = useAuthStore();
const currentUserId = computed(() => String(auth.user?.id));

const selectedChat = computed(
  () => chat.chats.find((c) => String(c.id) === String(selectedChatId.value)) || null
);

const sortedMessages = computed(() => {
  if (!selectedChat.value || !Array.isArray(selectedChat.value.raw)) return [];

  return [...selectedChat.value.raw].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt).getTime();
    const dateB = new Date(b.created_at || b.createdAt).getTime();

    return dateA - dateB; // Oldest → Newest
  });
});

const fieldError = (field) => {
  const value = chat.error?.validation?.[field];
  return Array.isArray(value) ? value[0] : value;
};

const initials = (name) =>
  String(name || "User")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
};

const loadChats = async () => {
  try {
    await chat.fetchChats();
  } catch {
    // Store owns rendered error state.
  }
};

const sendMessage = async () => {
  if (!selectedChat.value) return;
  try {
    await chat.sendMessage({
      receiver_id: selectedChat.value.otherId || selectedChat.value.id,
      message: form.message,
    });

    form.message = "";
  } catch {
    // Store owns rendered error state.
  }
};

watch(
  () => chat.chats,
  (conversations) => {
    if (!selectedChatId.value && conversations.length) {
      selectedChatId.value = conversations[0].id;
    }
  },
  { immediate: true }
);

// When selecting a conversation, mark messages from the other participant as seen
watch(
  () => selectedChatId.value,
  async (id) => {
    if (!id) return;

    const convo = chat.chats.find((c) => String(c.id) === String(id));
    if (!convo) return;

    const role = auth.user?.role || "teacher";
    const otherId = convo.otherId || convo.id;

    try {
await api.patch(`/chat/${otherId}/seen`)
      // Optimistically update local messages: mark messages from the other participant as seen
      if (convo && Array.isArray(convo.raw)) {
        convo.raw = convo.raw.map((m) =>
          String(m.sender_id || m.senderId || m.sender?.id) === String(otherId)
            ? { ...m, seen_at: new Date().toISOString() }
            : m
        );
      }
    } catch {
      // ignore
    }
  },
  { immediate: false }
);

onMounted(async () => {
  await loadChats();

  const userId = auth.user?.id;

  window.Echo.private(`chat.${userId}`)
    .listen(".message.sent", async (e) => {
      console.log("Realtime Message:", e);

      await loadChats();
    });
});
</script>
