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
import { computed, onMounted, onUnmounted } from "vue";
import ChatSidebar from "@/components/chat/ChatSidebar.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import { useChatStore } from "@/stores/shared/chatStore";
import { useMessageStore } from "@/stores/shared/messageStore";
import { useAuthStore } from "@/stores/auth/authStore";

const props = defineProps({
  role: {
    type: String,
    default: "student",
  },
});

const chatStore = useChatStore();
const messageStore = useMessageStore();
const auth = useAuthStore();

const roleLabel = computed(() =>
  props.role === "admin"
    ? "Chat monitoring"
    : props.role === "teacher"
    ? "Teacher messaging"
    : "Student messaging"
);

const sortedMessages = computed(() => {
  if (!chatStore.activeChat) return [];

  const msgs =
    messageStore.messagesForChat(chatStore.activeChat.id) || [];

  return [...msgs].sort(
    (a, b) =>
      new Date(a.created_at || a.createdAt).getTime() -
      new Date(b.created_at || b.createdAt).getTime()
  );
});

const selectChat = async (chat) => {
  chatStore.setActiveChat(chat);
  await messageStore.fetchMessages(chat.otherId);
};

const sendMessage = async (payload) => {
  if (!chatStore.activeChat) return;

  const message = await messageStore.sendMessage(
    chatStore.activeChat.otherId,
    payload
  );

  chatStore.receiveRealtimeMessage(
    chatStore.activeChat.otherId,
    message
  );
};

const refreshChats = async () => {
  await chatStore.fetchChats({
    role: props.role,
  });

  if (chatStore.activeChat) {
    await messageStore.fetchMessages(
      chatStore.activeChat.otherId
    );
  }
};

onMounted(async () => {
  await auth.bootstrap();

  await chatStore.fetchChats({
    role: props.role,
  });

  if (
    !chatStore.activeChat &&
    chatStore.chats.length
  ) {
    await selectChat(chatStore.chats[0]);
  }

  const userId = auth.user?.id;

  console.log("Echo User =", userId);

  if (!userId) return;

  // Subscribe to the private channel
  const channel = window.Echo.private(`chat.${userId}`);
  
  // Listen for message events. Note: verify if backend uses .broadcastAs() 
  // if ".message.sent" fails, try "MessageSent"
  channel.listen(".message.sent", async (e) => {
    console.log("Realtime Message Received:", e);
    await refreshChats();
  });
});

onUnmounted(() => {
  const userId = auth.user?.id;
  if (userId) {
    window.Echo.leave(`chat.${userId}`);
  }
});
</script>