<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">{{ announcement.audience === 'all' ? 'Global announcement' : announcement.course }}</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">{{ announcement.title }}</h3>
        <p class="mt-2 text-sm text-slate-500">{{ announcement.message }}</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{{ announcement.createdAt }}</span>
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
      <span class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{{ announcement.senderRole }}</span>
      <span v-if="announcement.emailEnabled" class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Email enabled</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  announcement: { type: Object, required: true }
})
</script>
