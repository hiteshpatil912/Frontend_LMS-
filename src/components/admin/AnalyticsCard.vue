<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p class="text-sm font-medium text-slate-500">{{ label }}</p>
    <div class="mt-3 flex items-end justify-between gap-3">
      <p class="text-3xl font-semibold text-slate-950">{{ value }}</p>
      <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{{ trend }}</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  trend: String
})
</script>
