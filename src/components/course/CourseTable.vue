<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div v-if="loading" class="divide-y divide-slate-100">
      <div v-for="row in 4" :key="row" class="grid gap-4 p-5 md:grid-cols-[1fr_140px_120px_120px]">
        <div class="h-5 animate-pulse rounded bg-slate-200"></div>
        <div class="h-5 animate-pulse rounded bg-slate-200"></div>
        <div class="h-5 animate-pulse rounded bg-slate-200"></div>
        <div class="h-5 animate-pulse rounded bg-slate-200"></div>
      </div>
    </div>

    <TransitionRoot v-else appear :show="true" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Course</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Instructor</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="course in courses" :key="course.id" class="hover:bg-slate-50">
                <td class="px-5 py-4">
                  <RouterLink class="text-sm font-semibold text-brand-700 hover:text-brand-600" :to="`${routeBase}/${course.id}`">{{ course.title }}</RouterLink>
                  <p class="mt-1 text-sm text-slate-500">{{ course.category }} / {{ course.level }} / {{ course.duration }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-4 text-sm text-slate-700">{{ course.instructor }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">${{ course.price }}</td>
                <td class="whitespace-nowrap px-5 py-4">
                  <CourseStatusBadge :status="course.status" />
                </td>
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
import CourseStatusBadge from '@/components/course/CourseStatusBadge.vue'

defineProps({
  courses: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  routeBase: {
    type: String,
    required: true
  }
})
</script>
