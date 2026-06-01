<template>
  <div class="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
    <AcademicCapIcon class="mx-auto size-12 text-slate-300" />
    <h3 class="mt-4 text-sm font-semibold text-slate-950">No courses found</h3>
    <p class="mt-1 text-sm text-slate-500">Create a course or adjust your search filters.</p>
    <RouterLink class="focus-ring mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="createTo">
      Create course
    </RouterLink>
  </div>
</template>

<script setup>
import { AcademicCapIcon } from '@heroicons/vue/24/outline'

defineProps({
  createTo: {
    type: String,
    required: true
  }
})
</script>
