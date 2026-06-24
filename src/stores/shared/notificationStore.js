import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const notificationTypes = [
  "system",
  "course",
  "quiz",
  "enrollment",
  "certificate",
  "assignment",
];

const shouldUseLocalFallback = (error) =>
  !error.response || [404, 405].includes(error.response.status);

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    notifications: [],
    toastQueue: [],
    loading: false,
    errors: {},
  }),

  getters: {
    unreadCount: (state) =>
      Array.isArray(state.notifications)
        ? state.notifications.filter((item) => !item.is_read).length
        : 0,

   recentNotifications: (state) =>
  Array.isArray(state.notifications)
    ? state.notifications
        .filter((item) => !item.is_read)
        .sort(
          (a, b) =>
            new Date(b.created_at || b.timestamp) -
            new Date(a.created_at || a.timestamp)
        )
        .slice(0, 6)
    : [],

    notificationsByType: (state) => (type) =>
      Array.isArray(state.notifications)
        ? state.notifications.filter((item) => item.type === type)
        : [],
  },

  actions: {
    async fetchNotifications() {
      this.loading = true;
      this.errors = {};

      try {
        const { data } = await api.get("/my-notifications");

        console.log("🔥 API Response =", data);
        console.log("🔥 Notifications Array =", data.notifications || data.data);

        this.notifications =
          data.notifications ||
          data.data ||
          [];
      } catch (error) {
        console.error(error);

        this.errors = {
          general: "Unable to sync notifications.",
        };
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(id) {
      try {
        await api.put(`/notifications/${id}/read`);
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = {
            general:
              error.response?.data?.message ||
              "Unable to mark notification as read.",
          };

          throw error;
        }
      } finally {
        this.notifications = this.notifications.map((item) =>
          String(item.id) === String(id)
            ? { ...item, is_read: true }
            : item
        );
      }
    },

    async markAllAsRead() {
      this.notifications = this.notifications.map((item) => ({
        ...item,
        is_read: true,
      }));
    },

    addRealtimeNotification(notification) {
      const item = {
        ...notification,
        is_read: false,
        timestamp:
          notification.created_at ||
          new Date().toISOString(),
      };

      this.notifications.unshift(item);
      this.toastQueue.unshift(item);
    },

    dismissToast(id) {
      this.toastQueue = this.toastQueue.filter(
        (item) => String(item.id) !== String(id)
      );
    },
  },
});