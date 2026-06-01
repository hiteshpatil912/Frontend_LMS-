<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">{{ assignment.course }}</p>
        <h3 class="mt-1 text-base font-semibold text-slate-950">{{ assignment.title }}</h3>
        <p class="mt-2 line-clamp-2 text-sm text-slate-500">{{ assignment.description }}</p>
      </div>
      <DueDateBadge :date="assignment.dueDate" />
    </div>
    <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div class="rounded-lg bg-slate-50 p-3">
        <p class="text-xs text-slate-500">Marks</p>
        <p class="mt-1 font-semibold text-slate-950">{{ assignment.totalMarks }}</p>
      </div>
      <div class="rounded-lg bg-slate-50 p-3">
        <p class="text-xs text-slate-500">Submissions</p>
        <p class="mt-1 font-semibold text-slate-950">{{ assignment.submissionsCount || 0 }}</p>
      </div>
    </div>
    <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
      <RouterLink class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50" :to="detailsTo">
        {{ detailsLabel }}
      </RouterLink>
      <slot />
    </div>
  </article>
</template>

<script setup>
import DueDateBadge from '@/components/assignment/DueDateBadge.vue'

defineProps({
  assignment: { type: Object, required: true },
  detailsTo: { type: String, required: true },
  detailsLabel: { type: String, default: 'View' }
})
</script>
