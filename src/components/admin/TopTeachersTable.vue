<template>
  <section class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-200 p-5">
      <h3 class="text-base font-semibold text-slate-950">Top instructors</h3>
    </div>
    <div class="divide-y divide-slate-100">
      <div v-for="teacher in rows" :key="teacher.id" class="flex items-center justify-between gap-4 p-5">
        <div>
          <p class="text-sm font-semibold text-slate-950">{{ teacher.name }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ teacher.courses }} courses / {{ teacher.students }} students</p>
        </div>
        <span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{{ teacher.rating }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ rows: { type: Array, default: () => [] } })
</script>
