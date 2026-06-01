<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Notification center</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Notifications</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Track system updates, course announcements, quiz alerts, reminders, and certificate messages.</p>
      </div>
      <button class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" @click="store.markAllAsRead()">
        Mark all as read
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Unread</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.unreadCount }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Total</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.notifications.length }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Types</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ types.length }}</p>
      </div>
    </div>

    <div v-if="store.loading" class="space-y-3">
      <div v-for="item in 5" :key="item" class="h-32 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <EmptyNotificationState v-else-if="!store.notifications.length" />
    <div v-else class="grid gap-4 xl:grid-cols-2">
      <NotificationCard v-for="notification in store.notifications" :key="notification.id" :notification="notification" @read="store.markAsRead(notification.id)" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import EmptyNotificationState from '@/components/notification/EmptyNotificationState.vue'
import NotificationCard from '@/components/notification/NotificationCard.vue'
import { useNotificationStore } from '@/stores/shared/notificationStore'

const store = useNotificationStore()
const types = computed(() => [...new Set(store.notifications.map((item) => item.type))])

onMounted(() => store.fetchNotifications())
</script>
