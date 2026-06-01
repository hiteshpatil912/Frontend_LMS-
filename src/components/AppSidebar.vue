<template>
  <aside class="flex h-full flex-col bg-slate-950 text-white">
    <div class="flex h-16 items-center gap-3 border-b border-white/10 px-5">
      <div class="grid size-10 place-items-center rounded-lg bg-brand-500 font-bold">L</div>
      <div>
        <p class="text-sm font-semibold">LearnSphere</p>
        <p class="text-xs text-slate-400">{{ roleLabel }}</p>
      </div>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-5">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.to"
        class="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
        :class="isActive(item.to) ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'"
      >
        <component :is="item.icon" class="size-5 shrink-0" />
        <span>{{ item.name }}</span>
      </RouterLink>
    </nav>

    <Disclosure v-slot="{ open }">
      <DisclosureButton class="flex w-full items-center justify-between border-t border-white/10 px-5 py-4 text-left text-sm text-slate-300">
        <span>Workspace health</span>
        <ChevronUpIcon class="size-4 transition" :class="open ? '' : 'rotate-180'" />
      </DisclosureButton>
      <DisclosurePanel class="px-5 pb-4 text-xs text-slate-400">
        API connected, 99.9% uptime, 14 active cohorts.
      </DisclosurePanel>
    </Disclosure>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  navigation: {
    type: Array,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

const route = useRoute()
const roleLabel = computed(() => `${props.role.charAt(0).toUpperCase()}${props.role.slice(1)} Portal`)
const isActive = (to) => route.path === to || route.path.startsWith(`${to}/`)
</script>
