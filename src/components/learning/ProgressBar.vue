<template>
  <div>
    <div class="flex items-center justify-between text-sm font-medium" :class="textClass">
      <span>{{ label }}</span>
      <span>{{ safeValue }}%</span>
    </div>
    <div class="mt-2 h-2 overflow-hidden rounded-full" :class="trackClass">
      <div class="h-full rounded-full transition-all duration-300" :class="barClass" :style="{ width: `${safeValue}%` }"></div>
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
  },
  dark: {
    type: Boolean,
    default: false
  }
})

const safeValue = computed(() => Math.min(100, Math.max(0, Math.round(props.value || 0))))
const textClass = computed(() => (props.dark ? 'text-slate-300' : 'text-slate-600'))
const trackClass = computed(() => (props.dark ? 'bg-white/10' : 'bg-slate-100'))
const barClass = computed(() => (props.dark ? 'bg-brand-500' : 'bg-brand-600'))
</script>
