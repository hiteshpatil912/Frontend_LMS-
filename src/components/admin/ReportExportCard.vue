<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-slate-950">{{ report.name }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ report.type }} / {{ report.format }} / Last: {{ report.lastExported }}</p>
      </div>
      <button class="focus-ring rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-70" type="button" :disabled="exporting" @click="$emit('export', report)">
        {{ exporting ? 'Exporting...' : 'Export' }}
      </button>
    </div>
  </article>
</template>

<script setup>
defineEmits(['export'])
defineProps({
  report: { type: Object, required: true },
  exporting: Boolean
})
</script>
