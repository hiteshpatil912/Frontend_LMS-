<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div v-if="loading" class="divide-y divide-slate-100">
      <div v-for="row in 4" :key="row" class="grid gap-4 p-5 md:grid-cols-[80px_1fr_120px_120px_180px]">
        <div v-for="cell in 5" :key="cell" class="h-5 animate-pulse rounded bg-slate-200"></div>
      </div>
    </div>
    <TransitionRoot v-else appear :show="true" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Order</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Lesson</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Course</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="lesson in lessons" :key="lesson.id" class="hover:bg-slate-50">
                <td class="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-700">#{{ lesson.order }}</td>
                <td class="px-5 py-4">
                  <p class="text-sm font-semibold text-slate-950">{{ lesson.title }}</p>
                  <p class="mt-1 text-sm text-slate-500">{{ lesson.slug }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-sm text-slate-700">{{ lesson.duration }}</td>
                <td class="whitespace-nowrap px-5 py-4">
                  <span class="rounded-full px-2.5 py-1 text-xs font-medium capitalize" :class="lesson.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">{{ lesson.status }}</span>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-sm text-slate-700">{{ lesson.courseName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TransitionChild>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { TransitionChild, TransitionRoot } from '@headlessui/vue'

defineProps({
  lessons: {
    type: Array,
    required: true
  },
  loading: Boolean
})
</script>
