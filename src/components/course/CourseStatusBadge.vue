<template>
  <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize" :class="statusClass">
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusClass = computed(() => {
  if (props.status === 'published') return 'bg-emerald-50 text-emerald-700'
  return 'bg-amber-50 text-amber-700'
})
</script>
