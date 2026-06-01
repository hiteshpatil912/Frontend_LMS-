<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Student workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Notifications</h1>
        <p class="mt-1 text-sm text-slate-500">Course updates, quiz alerts, and certificate messages.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="notifications.loading"
        @click="loadNotifications"
      >
        Refresh
      </button>
    </div>

    <div v-if="notifications.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ notifications.error.message }}
    </div>

    <div v-if="notifications.loading" class="space-y-3">
      <article v-for="item in 5" :key="item" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-3 h-4 w-full animate-pulse rounded bg-slate-100"></div>
        <div class="mt-4 h-4 w-32 animate-pulse rounded bg-slate-100"></div>
      </article>
    </div>

    <div v-else-if="notifications.hasNotifications" class="space-y-3">
      <article
        v-for="notification in notifications.notifications"
        :key="notification.id"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-semibold text-slate-950">{{ notification.title }}</h2>
              <span
                class="rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="notification.read ? 'bg-slate-100 text-slate-600' : 'bg-brand-50 text-brand-700'"
              >
                {{ notification.read ? 'Read' : 'Unread' }}
              </span>
            </div>
            <p class="mt-2 text-sm text-slate-600">{{ notification.message }}</p>
            <p class="mt-3 text-xs text-slate-500">{{ formatDate(notification.createdDate) }}</p>
          </div>

          <button
            v-if="!notification.read"
            type="button"
            class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="notifications.markingId === notification.id"
            @click="markAsRead(notification.id)"
          >
            {{ notifications.markingId === notification.id ? 'Saving...' : 'Mark As Read' }}
          </button>
        </div>
      </article>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      Notifications will appear here.
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLmsNotificationStore } from '@/stores/lms/notificationStore'

const notifications = useLmsNotificationStore()

const loadNotifications = async () => {
  try {
    await notifications.fetchNotifications()
  } catch {
    // Store owns the rendered error state.
  }
}

const markAsRead = async (id) => {
  try {
    await notifications.markAsRead(id)
  } catch {
    // Store owns the rendered error state.
  }
}

const formatDate = (value) => {
  if (!value) return 'Recently'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

onMounted(loadNotifications)
</script>
