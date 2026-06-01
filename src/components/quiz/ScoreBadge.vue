<template>
  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" :class="passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'">
    {{ passed ? 'Passed' : 'Failed' }}
  </span>
</template>

<script setup>
defineProps({ passed: Boolean })
</script>
