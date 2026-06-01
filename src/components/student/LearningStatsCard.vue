<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p class="text-sm font-medium text-slate-500">{{ label }}</p>
    <p class="mt-2 text-3xl font-semibold text-slate-950">{{ value }}</p>
    <p class="mt-3 text-sm text-slate-500">{{ caption }}</p>
  </article>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  caption: String
})
</script>
