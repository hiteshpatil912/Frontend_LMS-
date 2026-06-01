<template>
  <Menu as="div" class="relative">
    <MenuButton class="focus-ring relative rounded-lg p-2 text-slate-600 hover:bg-slate-100">
      <BellIcon class="size-6" />
      <NotificationBadge :count="store.unreadCount" />
    </MenuButton>
    <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="scale-95 opacity-0" enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">
      <MenuItems class="absolute right-0 z-30 mt-3 w-96 origin-top-right rounded-lg border border-slate-200 bg-white p-2 shadow-soft focus:outline-none">
        <div class="flex items-center justify-between px-2 py-2">
          <p class="text-sm font-semibold text-slate-950">Notifications</p>
          <span class="text-xs font-semibold text-brand-700">{{ store.unreadCount }} unread</span>
        </div>
        <div v-if="store.loading" class="space-y-2 p-2">
          <div v-for="item in 3" :key="item" class="h-16 animate-pulse rounded-lg bg-slate-100"></div>
        </div>
        <div v-else-if="!store.recentNotifications.length" class="p-4 text-center text-sm text-slate-500">No notifications yet.</div>
        <MenuItem v-for="item in store.recentNotifications" v-else :key="item.id" v-slot="{ active }">
          <button class="w-full rounded-md px-3 py-2 text-left" :class="active ? 'bg-slate-100' : ''" @click="store.markAsRead(item.id)">
            <div class="flex items-start gap-2">
              <span v-if="!item.read" class="mt-1.5 size-2 rounded-full bg-brand-600"></span>
              <div>
                <p class="text-sm font-medium text-slate-950">{{ item.title }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.message || item.body }}</p>
              </div>
            </div>
          </button>
        </MenuItem>
        <RouterLink class="mt-2 block rounded-lg bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100" to="/student/notifications">
          View notification history
        </RouterLink>
      </MenuItems>
    </Transition>
  </Menu>
</template>

<script setup>
import { onMounted } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems, TransitionRoot as Transition } from '@headlessui/vue'
import { BellIcon } from '@heroicons/vue/24/outline'
import NotificationBadge from '@/components/notification/NotificationBadge.vue'
import { useLmsNotificationStore } from '@/stores/lms/notificationStore'

const store = useLmsNotificationStore()
onMounted(() => store.fetchNotifications())
</script>
