<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Resume</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Continue Learning</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Resume your latest lessons, sync progress, and keep course completion moving.</p>
      </div>
      <RouterLink class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to="/student/history">
        Watch history
      </RouterLink>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Continue cards</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.inProgressCourses.length }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Recently watched</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ historyStore.recentLessons.length }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Completed courses</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.completedCourses.length }}</p>
      </div>
    </div>

    <div v-if="store.loading" class="space-y-4">
      <div v-for="item in 3" :key="item" class="h-56 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <EmptyContinueState v-else-if="!store.recentlyWatched.length" />
    <TransitionRoot v-else appear show as="template">
      <div class="space-y-4">
        <TransitionChild v-for="item in store.recentlyWatched" :key="item.id" as="template" enter="duration-200 ease-out" enter-from="opacity-0 translate-y-2" enter-to="opacity-100 translate-y-0">
          <ContinueLearningCard :item="item" @resume="resumeLesson" />
        </TransitionChild>
      </div>
    </TransitionRoot>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import ContinueLearningCard from '@/components/student/ContinueLearningCard.vue'
import EmptyContinueState from '@/components/student/EmptyContinueState.vue'
import { useStudentContinueLearningStore } from '@/stores/student/continueLearningStore'
import { useStudentWatchHistoryStore } from '@/stores/student/watchHistoryStore'

const store = useStudentContinueLearningStore()
const historyStore = useStudentWatchHistoryStore()

const resumeLesson = (item) => store.resumeLesson(item)

onMounted(() => store.fetchContinueLearning())
</script>
