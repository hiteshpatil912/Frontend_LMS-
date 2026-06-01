<template>
  <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium" :class="toneClass">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  }
})

const toneClass = computed(() => {
  if (props.label.includes('manage_roles')) return 'bg-indigo-50 text-indigo-700'
  if (props.label.includes('manage_users')) return 'bg-sky-50 text-sky-700'
  if (props.label.includes('manage_courses')) return 'bg-emerald-50 text-emerald-700'
  return 'bg-slate-100 text-slate-700'
})
</script>
