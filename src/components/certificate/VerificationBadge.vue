<template>
  <span :class="verified ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'" class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1">
    {{ verified ? 'Verified' : 'Pending verification' }}
  </span>
</template>

<script setup>
defineProps({
  verified: {
    type: Boolean,
    default: false
  }
})
</script>
