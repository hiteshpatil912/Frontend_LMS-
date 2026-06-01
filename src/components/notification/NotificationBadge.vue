<template>
  <span v-if="count" class="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-rose-600 px-1.5 text-xs font-semibold text-white">
    {{ count > 9 ? '9+' : count }}
  </span>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 0
  }
})
</script>
