<template>
  <span :class="classes" class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'category'
  }
})

const label = computed(() => props.value.replace(/[-_]/g, ' '))

const classes = computed(() => {
  if (props.type === 'status') {
    return props.value === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
  }
  return 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
})
</script>
