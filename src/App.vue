<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth/authStore";
import { initRealtimeNotifications } from "@/services/realtimeNotifications";

const auth = useAuthStore();

onMounted(async () => {
  await auth.bootstrap();

  initRealtimeNotifications();
});
</script>