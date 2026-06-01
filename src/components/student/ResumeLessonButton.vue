<template>
  <RouterLink class="focus-ring inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="to" @click="$emit('resume')">
    <PlayIcon class="mr-2 size-4" />
    Resume lesson
  </RouterLink>
</template>

<script setup>
import { PlayIcon } from '@heroicons/vue/20/solid'

defineProps({
  to: {
    type: String,
    required: true
  }
})

defineEmits(['resume'])
</script>
