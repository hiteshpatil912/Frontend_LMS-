<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-slate-500">{{ label }}</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ value }}</p>
      </div>
      <div class="grid size-11 place-items-center rounded-lg bg-brand-50 text-brand-700">
        <component :is="icon" class="size-6" />
      </div>
    </div>
    <p class="mt-4 text-sm" :class="trendTone">{{ trend }}</p>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [String, Number],
  trend: String,
  icon: Object,
  tone: {
    type: String,
    default: 'positive'
  }
})

const trendTone = computed(() => (props.tone === 'negative' ? 'text-rose-600' : 'text-emerald-600'))
</script>
