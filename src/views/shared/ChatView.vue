<template>
  <!-- Announcement Toast -->
  <transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-300"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="showAnnouncement"
      class="fixed top-5 right-5 z-[9999] w-96 rounded-xl border border-blue-200 bg-white shadow-2xl"
    >
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-blue-700">📢 New Announcement</h3>

          <button
            @click="showAnnouncement = false"
            class="text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <h4 class="mt-3 text-lg font-bold">
          {{ announcement.title }}
        </h4>

        <p class="mt-2 text-sm text-slate-600">
          {{ announcement.body }}
        </p>
      </div>
    </div>
  </transition>
  <section class="flex h-[calc(100vh-120px)] flex-col overflow-hidden">
    <!-- Page Header -->
    <div class="shrink-0 pb-6">
      <p class="text-sm font-medium text-brand-700">
        {{ roleLabel }}
      </p>

      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Live Chat</h2>

      <p class="mt-2 max-w-2xl text-sm text-slate-500">
        Direct messages, course conversations, unread state, and realtime-ready messaging.
      </p>
    </div>

    <!-- Chat Layout -->
    <div class="grid flex-1 gap-5 overflow-hidden xl:grid-cols-[360px_1fr]">
      <!-- Sidebar -->
      <div class="h-full overflow-hidden">
        <ChatSidebar
          :chats="chatStore.chats"
          :active-id="chatStore.activeChat?.id"
          :unread-total="0"
          :loading="chatStore.loading"
          @select="selectChat"
        />
      </div>

      <!-- Chat Window -->
      <div class="h-full overflow-hidden">
        <ChatWindow
          :chat="chatStore.activeChat"
          :messages="sortedMessages"
          :loading="false"
          :sending="messageStore.sending"
          :role="props.role"
          @send="sendMessage"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import ChatSidebar from "@/components/chat/ChatSidebar.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import { useChatStore } from "@/stores/shared/chatStore";
import { useMessageStore } from "@/stores/shared/messageStore";
import { useAuthStore } from "@/stores/auth/authStore";

const notificationSound = new Audio("/sounds/notification.mp3");
notificationSound.preload = "auto";

const props = defineProps({
  role: {
    type: String,
    default: "student",
  },
});

const chatStore = useChatStore();
const messageStore = useMessageStore();
const auth = useAuthStore();
const showAnnouncement = ref(false);

const announcement = ref({
  title: "",
  body: "",
});

const roleLabel = computed(() =>
  props.role === "admin"
    ? "Chat monitoring"
    : props.role === "teacher"
    ? "Teacher messaging"
    : "Student messaging"
);

const sortedMessages = computed(() => {
  if (!chatStore.activeChat) return [];

  const msgs = messageStore.messagesForChat(chatStore.activeChat.id) || [];

  return [...msgs].sort(
    (a, b) =>
      new Date(a.created_at || a.createdAt).getTime() -
      new Date(b.created_at || b.createdAt).getTime()
  );
});

const selectChat = async (chat) => {
  console.log("SELECTED CHAT =", chat);

  chatStore.setActiveChat(chat);

  await messageStore.fetchMessages(chat.otherId);
};

const sendMessage = async (payload) => {
  if (!chatStore.activeChat) return;

  await messageStore.sendMessage(chatStore.activeChat.otherId, payload);
};

const refreshChats = async () => {
  await chatStore.fetchChats({
    role: props.role,
  });
  console.log("🔥 Chats =", chatStore.chats);

  if (chatStore.activeChat) {
    await messageStore.fetchMessages(chatStore.activeChat.otherId);
  }
};

onMounted(async () => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
  // 🔓 Unlock Audio on first click
  const unlockAudio = () => {
    notificationSound
      .play()
      .then(() => {
        notificationSound.pause();
        notificationSound.currentTime = 0;
        console.log("🔓 Audio Unlocked");
      })
      .catch(() => {});

    window.removeEventListener("click", unlockAudio);
  };

  window.addEventListener("click", unlockAudio);

  await auth.bootstrap();

  await chatStore.fetchChats({
    role: props.role,
  });
  console.log("🔥 Chats JSON =", JSON.stringify(chatStore.chats, null, 2));

  if (!chatStore.activeChat && chatStore.chats.length) {
    await selectChat(chatStore.chats[0]);
  }

  const userId = auth.user?.id;

  console.log("Echo User =", userId);

  if (!userId) return;
  // ===============================
  // Global Announcement Channel
  // ===============================

  const announcementChannel = window.Echo.private("announcement");

  announcementChannel.listen(".announcement.created", (e) => {
    console.log("📢 Announcement Received", e);

    announcement.value = {
      title: e.announcement.title,
      body: e.announcement.body,
    };

    showAnnouncement.value = true;

    // 🔔 Sound
    notificationSound.currentTime = 0;

    notificationSound.play().catch(() => {});

    setTimeout(() => {
      showAnnouncement.value = false;
    }, 5000);
  });

  // ===============================
  // Presence Channel
  // ===============================

  window.Echo.join("online")

    .here((users) => {
      console.log("🟢 Online Users", users);

      users.forEach((user) => {
        chatStore.setOnline(user.id, true);
      });
    })

    .joining((user) => {
      console.log("➕ User Joined", user);

      chatStore.setOnline(user.id, true);
    })

    .leaving((user) => {
      console.log("➖ User Left", user);

      chatStore.setOnline(user.id, false);
    });

  // ===============================
  // Private Chat Channel
  // ===============================

  const channel = window.Echo.private(`chat.${userId}`);

  // console.log("🔥 Joining Chat Channel =", `chat.${userId}`);

  channel.subscribed(() => {
    console.log("✅ CHAT SUBSCRIBED", userId);
  });

  channel.error((err) => {
    console.log("❌ CHAT ERROR", err);
  });

  channel.listen(".message.sent", async (e) => {
    console.log("🔥 MESSAGE RECEIVED", e);

    const chat = e.chat;

    // 🔔 Play sound only for incoming messages
    // if (String(chat.sender_id) !== String(auth.user?.id)) {
    //   notificationSound.currentTime = 0;

    //   notificationSound.play().catch((err) => {
    //     console.log("🔇 Sound Error", err);
    //   });

    //   if (
    //     Notification.permission === "granted" &&
    //     document.hidden &&
    //     String(chat.sender_id) !== String(auth.user?.id)
    //   ) {
    //     new Notification("New Message", {
    //       body: chat.message,
    //     });
    //   }
    // }

    // ⭐ Update sidebar
    chatStore.receiveRealtimeMessage(chat.sender_id, chat);

    // ⭐ Refresh current chat messages
    await messageStore.fetchMessages(chat.sender_id);

    // ⭐ Refresh chat list
    await chatStore.fetchChats({
      role: props.role,
    });
  });

  channel.listen(".message.seen", (e) => {
    Object.keys(messageStore.messages).forEach((chatId) => {
      messageStore.messages[chatId] = messageStore.messages[chatId].map((msg) => {
        if (String(msg.id) === String(e.message_id)) {
          return {
            ...msg,
            seen_at: e.seen_at,
          };
        }

        return msg;
      });
    });
  });

  channel.listen(".typing.started", (e) => {
    chatStore.setTyping(e.sender_id, true);
  });

  channel.listen(".typing.stopped", (e) => {
    chatStore.setTyping(e.sender_id, false);
  });
});

onUnmounted(() => {
  const userId = auth.user?.id;

  if (userId) {
    window.Echo.leave(`chat.${userId}`);
    window.Echo.leave("online");
    window.Echo.leave("announcement");
  }
});
</script>
