<template>
  <div>
    <div class="flex items-center justify-between text-xs font-medium text-slate-500">
      <span>{{ label }}</span>
      <span>{{ value }}%</span>
    </div>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
      <div class="h-full rounded-full bg-brand-600 transition-all" :style="{ width: `${value}%` }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    default: 'Progress'
  }
})
</script>
