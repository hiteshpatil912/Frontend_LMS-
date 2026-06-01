<template>
  <div class="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
    <VideoCameraIcon class="mx-auto size-12 text-slate-300" />
    <h3 class="mt-4 text-sm font-semibold text-slate-950">No lessons found</h3>
    <p class="mt-1 text-sm text-slate-500">Create the first lesson for this course to start building the curriculum.</p>
    <RouterLink class="focus-ring mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="createTo">Create lesson</RouterLink>
  </div>
</template>

<script setup>
import { VideoCameraIcon } from '@heroicons/vue/24/outline'

defineProps({
  createTo: {
    type: String,
    required: true
  }
})
</script>
