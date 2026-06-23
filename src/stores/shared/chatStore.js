import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { useAuthStore } from "@/stores/auth/authStore";

const normalize = (data) => data.data || data;
const shouldUseLocalFallback = (error) =>
  !error.response || [404, 405].includes(error.response.status);

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [],

    discussionRooms: [],

    activeChat: null,

    unreadMessages: 0,

    loading: false,

    saving: false,

    errors: {},
  }),
  getters: {
    items: (state) => state.chats,
    directChats: (state) =>
      state.chats.filter((chat) => chat.type === "direct"),
    courseDiscussions: (state) => state.discussionRooms,
    unreadTotal: (state) =>
      (state.chats || []).reduce(
        (total, chat) => total + (chat.unread || 0),
        0,
      ),
  },
  actions: {
    async fetchChats(params = {}) {
      const oldChats = this.chats;

      this.loading = true;
      this.errors = {};

      try {
        const role = params.role || "student";
        const { data } = await api.get(`/${role}/chat`, { params });

        const result = data.data || data;
        const auth = useAuthStore();
        const currentUserId = String(auth.user?.id);

        const raw = result.chats || result.data || result;

        if (Array.isArray(raw)) {
          const groups = {};

          raw.forEach((m) => {
            const s = String(m.sender_id || m.sender?.id);
            const r = String(m.receiver_id || m.receiver?.id);

            const otherId = s === currentUserId ? r : s;

            if (!groups[otherId]) {
              const existing = oldChats.find(
                (c) => String(c.otherId) === String(otherId),
              );

              groups[otherId] = {
                id: otherId,
                otherId,

                name:
                  s === currentUserId
                    ? m.receiver?.name || m.receiver?.email || `User #${r}`
                    : m.sender?.name || m.sender?.email || `User #${s}`,

                lastMessage: m.message || "",

                createdAt: m.created_at || m.createdAt,

                course_id: m.course_id ?? m.course?.id ?? null,
                
                raw: [],

                // ⭐ Preserve previous state
                typing: existing?.typing ?? false,

                online: existing?.online ?? false,

                unread: existing?.unread ?? 0,
              };
            }

            // Message add (mark ownership)
            const messageWithOwner = {
              ...m,
              mine: String(m.sender_id || m.sender?.id) === currentUserId,
              body: m.message || m.body || "",
            };

            groups[otherId].raw.push(messageWithOwner);

            // Latest message update
            const currentTime = new Date(m.created_at || m.createdAt).getTime();

            const savedTime = new Date(groups[otherId].createdAt).getTime();

            if (currentTime > savedTime) {
              groups[otherId].lastMessage = m.message || "";
              groups[otherId].createdAt = m.created_at || m.createdAt;
            }
          });

          // 👇 Sort messages inside each chat (Oldest → Newest)
          Object.values(groups).forEach((chat) => {
            chat.raw.sort(
              (a, b) =>
                new Date(a.created_at || a.createdAt).getTime() -
                new Date(b.created_at || b.createdAt).getTime(),
            );
          });

          // 👇 Sort conversation list (Newest conversation on top)
          this.chats = Object.values(groups).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        } else {
          this.chats = raw;
        }

        this.discussionRooms = result.discussionRooms || this.discussionRooms;
      } catch (error) {
        this.errors = {
          general: "Unable to sync chats. Showing local messages.",
        };
      } finally {
        this.unreadMessages = this.unreadTotal;
        this.loading = false;
      }
    },
    setActiveChat(chat) {
      this.chats = this.chats.map((item) => {
        if (String(item.id) === String(chat.id)) {
          this.activeChat = {
            ...item,
            unread: 0,
          };

          return {
            ...item,
            unread: 0,
          };
        }

        return item;
      });

      this.unreadMessages = this.unreadTotal;
    },
    async createDiscussionRoom(payload) {
      this.saving = true;
      this.errors = {};
      try {
        const { data } = await api.post("/student/chat/discussions", payload);
        const room = normalize(data);
        this.discussionRooms.unshift(room);
        return room;
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = error.response?.data?.errors || {
            general:
              error.response?.data?.message ||
              "Unable to create discussion room.",
          };
          throw error;
        }
        const room = {
          ...payload,
          id: Date.now(),
          participants: 0,
          unread: 0,
          online: 0,
          lastMessage: "Discussion room created.",
        };
        this.discussionRooms.unshift(room);
        return room;
      } finally {
        this.saving = false;
      }
    },

    receiveRealtimeMessage(chatId, message) {
      const exists = this.chats.some(
        (c) => String(c.otherId) === String(chatId),
      );

      if (!exists) {
        this.fetchChats();
        return;
      }
      const auth = useAuthStore();
      const currentUserId = String(auth.user?.id);

      this.chats = this.chats.map((chat) => {
        if (String(chat.id) !== String(chatId)) {
          return chat;
        }
        const msg = {
          ...message,
          mine:
            String(message.sender_id || message.sender?.id) === currentUserId,
          body: message.message || message.body || "",
          seen_at: message.seen_at ?? null,
        };
        const updatedRaw = [...(chat.raw || []), msg].sort(
          (a, b) =>
            new Date(a.created_at || a.createdAt).getTime() -
            new Date(b.created_at || b.createdAt).getTime(),
        );

        return {
          ...chat,
          raw: updatedRaw,
          lastMessage: msg.message || msg.body,
          createdAt: msg.created_at || msg.createdAt,
          unread:
            this.activeChat &&
            String(this.activeChat.otherId) === String(chat.otherId)
              ? 0
              : Number(chat.unread || 0) + 1,
        };
      });

      // Conversation list latest वर ठेव
      this.chats.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      this.unreadMessages = this.unreadTotal;
    },
    setTyping(senderId, typing = true) {
      this.chats = this.chats.map((chat) => {
        if (String(chat.otherId) === String(senderId)) {
          return {
            ...chat,
            typing,
          };
        }

        return chat;
      });

      // ⭐ Active Chat Header Update
      if (
        this.activeChat &&
        String(this.activeChat.otherId) === String(senderId)
      ) {
        this.activeChat = {
          ...this.activeChat,
          typing,
        };
      }
    },
    setOnline(userId, online = true) {
      this.chats = this.chats.map((chat) => {
        if (String(chat.otherId) === String(userId)) {
          return {
            ...chat,
            online,
          };
        }

        return chat;
      });

      if (
        this.activeChat &&
        String(this.activeChat.otherId) === String(userId)
      ) {
        this.activeChat = {
          ...this.activeChat,
          online,
        };
      }
    },
  },
});
