<template>
  <div class="min-h-screen bg-slate-50">
    <TransitionRoot :show="sidebarOpen" as="template">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-200" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-950/45" />
        </TransitionChild>
        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-200 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-200 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <AppSidebar :navigation="navigation" :role="role" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
      <AppSidebar :navigation="navigation" :role="role" />
    </div>

    <div class="lg:pl-72">
      <AppNavbar :title="title" :eyebrow="roleEyebrow" @open-sidebar="sidebarOpen = true" />
      <main class="px-4 py-6 sm:px-6 lg:px-8">
        <nav v-if="breadcrumbs.length" class="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <template v-for="crumb in breadcrumbs" :key="crumb.path">
            <span>/</span>
            <span class="font-medium text-slate-700">{{ crumb.label }}</span>
          </template>
        </nav>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useBreadcrumbs } from '@/composables/useBreadcrumbs'

const props = defineProps({
  role: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  navigation: {
    type: Array,
    required: true
  }
})

const sidebarOpen = ref(false)
const { breadcrumbs } = useBreadcrumbs()
const roleEyebrow = computed(() => `${props.role.charAt(0).toUpperCase()}${props.role.slice(1)} workspace`)
</script>
