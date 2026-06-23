import { useAuthStore } from "@/stores/auth/authStore";

const notificationSound = new Audio("/sounds/notification.mp3");
notificationSound.preload = "auto";

let initialized = false;

export const initRealtimeNotifications = () => {
  if (initialized) return;

  const auth = useAuthStore();

  const userId = auth.user?.id;

  if (!userId || !window.Echo) return;

  initialized = true;

  console.log("🔔 Global Notification Started");

  window.Echo.private(`chat.${userId}`)
    .listen(".message.sent", (e) => {
      console.log("🔔 Global Message Received", e);

      if (String(e.chat.sender_id) !== String(userId)) {
        notificationSound.currentTime = 0;

        notificationSound.play().catch((err) => {
          console.log("🔇 Sound Error", err);
        });
      }
    });
};