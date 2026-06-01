<template>
  <div class="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
    <div class="mx-auto flex size-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
      <PlayCircleIcon class="size-7" />
    </div>
    <h3 class="mt-4 text-sm font-semibold text-slate-950">{{ title }}</h3>
    <p class="mx-auto mt-2 max-w-md text-sm text-slate-500">{{ message }}</p>
    <RouterLink class="focus-ring mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" to="/student/admin/courses">
      Browse courses
    </RouterLink>
  </div>
</template>

<script setup>
import { PlayCircleIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    default: 'Nothing to resume yet'
  },
  message: {
    type: String,
    default: 'Start a course lesson and your latest learning activity will appear here.'
  }
})
</script>
