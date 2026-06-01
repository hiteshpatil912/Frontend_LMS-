<template>
  <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="h-32 bg-gradient-to-br from-sky-500 via-indigo-500 to-cyan-400"></div>
    <div class="p-5">
      <div class="flex items-center justify-between gap-3">
        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{{ course.level }}</span>
        <span class="rounded-full px-2.5 py-1 text-xs font-medium capitalize" :class="course.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">{{ course.status.replace('_', ' ') }}</span>
      </div>
      <h3 class="mt-4 text-base font-semibold text-slate-950">{{ course.title }}</h3>
      <p class="mt-2 line-clamp-2 text-sm text-slate-500">{{ course.description }}</p>
      <ProgressBar class="mt-5" :value="progress" />
      <div class="mt-5 grid gap-2 sm:grid-cols-2">
        <RouterLink class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="`/student/admin/courses/${course.id}`">
          Continue
        </RouterLink>
        <RouterLink class="focus-ring inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" :to="`/student/admin/courses/${course.id}/review`">
          Review
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import ProgressBar from '@/components/student/ProgressBar.vue'

defineProps({
  course: {
    type: Object,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  }
})
</script>
