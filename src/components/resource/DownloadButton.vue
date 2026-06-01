<template>
  <button class="focus-ring inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70" type="button" :disabled="loading" @click="$emit('download')">
    <ArrowDownTrayIcon class="mr-2 size-4" />
    {{ loading ? 'Preparing...' : label }}
  </button>
</template>

<script setup>
import { ArrowDownTrayIcon } from '@heroicons/vue/20/solid'

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Download'
  }
})

defineEmits(['download'])
</script>
