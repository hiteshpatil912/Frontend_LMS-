<template>
  <div class="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
    <div class="mx-auto flex size-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
      <CheckBadgeIcon class="size-7" />
    </div>
    <h3 class="mt-4 text-sm font-semibold text-slate-950">{{ title }}</h3>
    <p class="mx-auto mt-2 max-w-md text-sm text-slate-500">{{ message }}</p>
  </div>
</template>

<script setup>
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    default: 'No certificates yet'
  },
  message: {
    type: String,
    default: 'Complete every lesson, pass the quiz, and finish a course to generate a certificate.'
  }
})
</script>
