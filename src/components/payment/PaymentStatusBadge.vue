<template>
  <span :class="classes" class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize">
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, default: 'pending' } })
const classes = computed(() => ({
  paid: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-rose-50 text-rose-700',
  refunded: 'bg-slate-100 text-slate-600',
  active: 'bg-emerald-50 text-emerald-700'
}[props.status] || 'bg-slate-100 text-slate-600'))
</script>
