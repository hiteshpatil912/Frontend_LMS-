<template>
  <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" :class="online ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
    <span class="size-1.5 rounded-full" :class="online ? 'bg-emerald-500' : 'bg-slate-400'"></span>
    {{ online ? 'Online' : 'Offline' }}
  </span>
</template>

<script setup>
defineProps({ online: { type: Boolean, default: false } })
</script>
