<template>
  <div class="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
    <div class="mx-auto flex size-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
      <StarIcon class="size-7" />
    </div>
    <h3 class="mt-4 text-sm font-semibold text-slate-950">{{ title }}</h3>
    <p class="mx-auto mt-2 max-w-md text-sm text-slate-500">{{ message }}</p>
  </div>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/24/solid'

defineProps({
  title: {
    type: String,
    default: 'No reviews yet'
  },
  message: {
    type: String,
    default: 'Course reviews and ratings will appear here once students share feedback.'
  }
})
</script>
