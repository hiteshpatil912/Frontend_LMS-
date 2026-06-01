<template>
  <span :class="classes" class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize">
    {{ status.replace('_', ' ') }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, default: 'pending' } })
const classes = computed(() => {
  if (props.status === 'graded') return 'bg-emerald-50 text-emerald-700'
  if (props.status === 'late') return 'bg-rose-50 text-rose-700'
  if (props.status === 'submitted') return 'bg-brand-50 text-brand-700'
  return 'bg-slate-100 text-slate-600'
})
</script>
