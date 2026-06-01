<template>
  <span class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
    <StarIcon class="mr-1 size-3.5 fill-amber-400 text-amber-400" />
    {{ rating.toFixed(1) }} · {{ count }} reviews
  </span>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/24/solid'

defineProps({
  rating: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  }
})
</script>
