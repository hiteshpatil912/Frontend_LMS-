<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Learning activity</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Watch History</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Review recently watched lessons, saved timestamps, and lesson progress.</p>
      </div>
      <RouterLink class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" to="/student/continue-learning">
        Continue learning
      </RouterLink>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <WatchHistoryTable :items="store.recentLessons" :loading="store.loading" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import WatchHistoryTable from '@/components/student/WatchHistoryTable.vue'
import { useStudentWatchHistoryStore } from '@/stores/student/watchHistoryStore'

const store = useStudentWatchHistoryStore()

onMounted(() => store.fetchWatchHistory())
</script>
