<template>
  <button class="focus-ring inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="button" :disabled="loading" @click="$emit('download')">
    <ArrowDownTrayIcon class="mr-2 size-4" />
    {{ loading ? 'Preparing...' : 'Download PDF' }}
  </button>
</template>

<script setup>
import { ArrowDownTrayIcon } from '@heroicons/vue/20/solid'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['download'])
</script>
