<template>
  <div>
    <div class="flex items-center justify-between text-xs font-medium text-slate-500">
      <span>{{ label }}</span>
      <span>{{ value }}%</span>
    </div>
    <div class="mt-2 h-2 rounded-full bg-slate-200">
      <div class="h-2 rounded-full bg-brand-600 transition-all duration-300" :style="{ width: `${boundedValue}%` }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: 'Progress'
  }
})

const boundedValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>
