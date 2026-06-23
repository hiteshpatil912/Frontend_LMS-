import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { useAuthStore } from "@/stores/auth/authStore";

const shouldUseLocalFallback = (error) =>
  !error.response || [404, 405].includes(error.response.status);

const unwrap = (response) =>
  response?.data?.data || response?.data || response || {};

export const useMessageStore = defineStore("messages", {
  state: () => ({
    messages: {}, // Keyed by participant ID (otherId)
    loading: false,
    sending: false,
    errors: {},
  }),

  getters: {
    messagesForChat: (state) => (chatId) => state.messages[chatId] || [],
  },

  actions: {
    async fetchMessages(chatId) {
      console.log("fetchMessages", chatId);

      this.loading = true;
      this.errors = {};

      const auth = useAuthStore();
      const role = auth.user?.role || "student";
      const currentUserId = String(auth.user?.id);
      const selectedUserId = String(chatId);

      try {
        const response = await api.get(`/${role}/chat`);
        const payload = unwrap(response);
        const allMessages = Array.isArray(payload)
          ? payload
          : payload.chats || payload.data || [];

        // Filter flat messages for this specific conversation pair
        this.messages[chatId] = allMessages
          .filter((m) => {
            const s = String(m.sender_id || m.senderId || m.sender?.id);
            const r = String(m.receiver_id || m.receiverId || m.receiver?.id);
            return (
              (s === currentUserId && r === selectedUserId) ||
              (s === selectedUserId && r === currentUserId)
            );
          })
          .map((m) => ({
            ...m,
            mine:
              String(m.sender_id || m.senderId || m.sender?.id) ===
              currentUserId,
            body: m.message || m.body || "",
          }));
        // Mark messages as seen
        try {
          await api.patch(`/${role}/chat/${chatId}/seen`);

          // Local state update (instant UI)
          this.messages[chatId] = (this.messages[chatId] || []).map((m) => {
            const senderId = String(m.sender_id || m.senderId || m.sender?.id);

            if (senderId === selectedUserId) {
              return {
                ...m,
                seen_at: new Date().toISOString(),
              };
            }

            return m;
          });
        } catch (e) {
          console.log("Seen API failed", e);
        }
      } catch (error) {
        this.errors = {
          general: "Unable to load messages.",
        };

        this.messages[chatId] = [];
      } finally {
        this.loading = false;
      }
      console.log("loaded", this.messages[chatId]);
    },

    async sendMessage(chatId, payload) {
      this.sending = true;
      this.errors = {};

      const auth = useAuthStore();
      const role = auth.user?.role || "student";

      try {
        const response = await api.post(`/${role}/chat`, {
          receiver_id: chatId,
          message: payload.body,
        });

        const result = unwrap(response);
        const rawMessage =
          result.chat || result.message || result.data || result;
        const message = {
          ...rawMessage,
          mine: true,
          body: rawMessage.message || rawMessage.body || payload.body,
          seen_at: rawMessage.seen_at ?? null, // ⭐ ADD
        };

        this.messages[chatId] = [...(this.messages[chatId] || []), message];

        return message;
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = {
            general: error.response?.data?.message || "Unable to send message.",
          };

          throw error;
        }

        const localMessage = {
          id: Date.now(),
          sender_id: auth.user?.id,
          receiver_id: chatId,
          message: payload.body,
          created_at: new Date().toISOString(),
          mine: true,
        };

        this.messages[chatId] = [
          ...(this.messages[chatId] || []),
          localMessage,
        ];

        return localMessage;
      } finally {
        this.sending = false;
      }
    },

    async markMessageRead(chatId, messageId) {
      this.messages[chatId] = (this.messages[chatId] || []).map((message) =>
        String(message.id) === String(messageId)
          ? {
              ...message,
              read: true,
            }
          : message,
      );
    },
addRealtimeMessage(chat) {
  const auth = useAuthStore();

  const currentUserId = String(auth.user?.id);

  const otherId =
    String(chat.sender_id) === currentUserId
      ? String(chat.receiver_id)
      : String(chat.sender_id);

  if (!this.messages[otherId]) {
    this.messages[otherId] = [];
  }

  const exists = this.messages[otherId].some(
    (m) => String(m.id) === String(chat.id)
  );

  if (exists) return;

  this.messages[otherId].push({
    ...chat,
    mine: String(chat.sender_id) === currentUserId,
    body: chat.message || "",
  });
},
    clearMessages(chatId) {
      this.messages[chatId] = [];
    },
  },
});
