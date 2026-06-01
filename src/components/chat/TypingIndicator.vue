<template>
  <div v-if="show" class="flex items-center gap-2 text-xs font-medium text-slate-500">
    <span class="flex gap-1">
      <span class="size-1.5 animate-bounce rounded-full bg-slate-400"></span>
      <span class="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]"></span>
      <span class="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]"></span>
    </span>
    typing
  </div>
</template>

<script setup>
defineProps({ show: { type: Boolean, default: false } })
</script>
