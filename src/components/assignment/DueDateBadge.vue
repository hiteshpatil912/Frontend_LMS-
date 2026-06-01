<template>
  <span :class="late ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-slate-100 text-slate-600 ring-slate-200'" class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1">
    {{ late ? 'Late' : formatted }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ date: { type: String, required: true } })
const late = computed(() => new Date() > new Date(props.date))
const formatted = computed(() => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(props.date)))
</script>
