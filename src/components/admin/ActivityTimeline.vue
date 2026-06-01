<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-base font-semibold text-slate-950">Recent activities</h3>
    <ol class="mt-5 space-y-4">
      <li v-for="activity in rows" :key="activity.id" class="flex gap-3">
        <span class="mt-1 size-2 rounded-full bg-brand-600"></span>
        <div>
          <p class="text-sm font-medium text-slate-950">{{ activity.title }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ activity.type }} / {{ activity.time }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>
defineProps({ rows: { type: Array, default: () => [] } })
</script>
