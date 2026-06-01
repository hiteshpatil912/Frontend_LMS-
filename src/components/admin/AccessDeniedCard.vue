<template>
  <section class="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
    <NoSymbolIcon class="mx-auto size-12 text-rose-500" />
    <h2 class="mt-4 text-xl font-semibold text-slate-950">{{ title }}</h2>
    <p class="mt-2 text-sm text-slate-500">{{ message }}</p>
    <RouterLink class="focus-ring mt-6 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" to="/admin/dashboard">
      Back to dashboard
    </RouterLink>
  </section>
</template>

<script setup>
import { NoSymbolIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    default: 'Access denied'
  },
  message: {
    type: String,
    default: 'Your current permissions do not allow access to this module.'
  }
})
</script>
