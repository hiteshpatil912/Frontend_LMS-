<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div v-if="loading" class="animate-pulse space-y-3">
      <div class="h-4 w-2/3 rounded bg-slate-200"></div>
      <div class="h-8 w-20 rounded bg-slate-200"></div>
    </div>

    <template v-else>
      <p class="text-sm font-medium text-slate-500">{{ label }}</p>
      <p class="mt-2 text-3xl font-semibold text-slate-950">{{ value }}</p>
    </template>
  </article>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
