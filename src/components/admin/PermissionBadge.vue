<template>
  <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium" :class="toneClass">
    {{ formatted }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  permission: {
    type: String,
    required: true
  }
})

const formatted = computed(() =>
  props.permission
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
)

const toneClass = computed(() => {
  if (props.permission.includes('roles') || props.permission.includes('settings')) return 'bg-indigo-50 text-indigo-700'
  if (props.permission.includes('users') || props.permission.includes('students') || props.permission.includes('teachers')) return 'bg-sky-50 text-sky-700'
  if (props.permission.includes('courses')) return 'bg-emerald-50 text-emerald-700'
  return 'bg-amber-50 text-amber-700'
})
</script>
