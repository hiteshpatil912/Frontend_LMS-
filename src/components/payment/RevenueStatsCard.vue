<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p class="text-sm text-slate-500">{{ label }}</p>
    <p class="mt-2 text-2xl font-semibold text-slate-950">${{ Number(value).toLocaleString() }}</p>
    <p v-if="caption" class="mt-1 text-xs text-slate-500">{{ caption }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: Number, default: 0 },
  caption: { type: String, default: '' }
})
</script>
