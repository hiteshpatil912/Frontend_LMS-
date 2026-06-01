<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-slate-950">{{ title }}</h2>
      <span class="text-sm text-slate-500">{{ caption }}</span>
    </div>
    <div class="mt-5 grid gap-4 sm:grid-cols-3">
      <div v-for="item in stats" :key="item.label">
        <p class="text-sm text-slate-500">{{ item.label }}</p>
        <p class="mt-1 text-2xl font-semibold text-slate-950">{{ item.value }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  caption: String,
  stats: {
    type: Array,
    default: () => []
  }
})
</script>
