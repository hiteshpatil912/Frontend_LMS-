<template>
  <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <div class="flex min-w-0 items-center gap-3">
        <button class="focus-ring rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" type="button" @click="$emit('open-sidebar')">
          <Bars3Icon class="size-6" />
        </button>
        <div class="min-w-0">
          <p class="truncate text-sm text-slate-500">{{ eyebrow }}</p>
          <h1 class="truncate text-lg font-semibold text-slate-950">{{ title }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <NotificationDropdown />
        <Popover class="relative">
          <PopoverButton class="focus-ring rounded-lg p-2 text-slate-600 hover:bg-slate-100">
            <QuestionMarkCircleIcon class="size-6" />
          </PopoverButton>
          <PopoverPanel class="absolute right-0 z-30 mt-3 w-72 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-soft">
            LMS support, release notes, and onboarding assets are available in the knowledge center.
          </PopoverPanel>
        </Popover>
        <Menu as="div" class="relative">
          <MenuButton class="focus-ring flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100">
            <div class="grid size-8 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">{{ initials }}</div>
          </MenuButton>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 z-30 mt-3 w-48 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-soft focus:outline-none">
              <MenuItem v-slot="{ active }">
                <button class="w-full rounded-md px-3 py-2 text-left text-sm" :class="active ? 'bg-slate-100' : ''">Profile</button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button class="w-full rounded-md px-3 py-2 text-left text-sm" :class="active ? 'bg-slate-100' : ''" @click="auth.logout()">Sign out</button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
    <ToastNotification :toasts="notifications.toastQueue" @dismiss="notifications.dismissToast" />
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel, TransitionRoot as Transition } from '@headlessui/vue'
import { Bars3Icon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import ToastNotification from '@/components/notification/ToastNotification.vue'
import { useAuthStore } from '@/stores/auth/authStore'
import { useNotificationStore } from '@/stores/shared/notificationStore'

defineEmits(['open-sidebar'])
defineProps({
  title: {
    type: String,
    required: true
  },
  eyebrow: {
    type: String,
    default: 'Learning management system'
  }
})

const auth = useAuthStore()
const notifications = useNotificationStore()
const initials = computed(() => auth.user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'LS')
</script>
