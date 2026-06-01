<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-base font-semibold text-slate-950">{{ quiz.title }}</h3>
        <p class="mt-2 text-sm text-slate-500">{{ quiz.description }}</p>
      </div>
      <span class="rounded-full px-2.5 py-1 text-xs font-medium capitalize" :class="quiz.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">{{ quiz.status }}</span>
    </div>
    <div class="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
      <span>{{ quiz.courseName }}</span>
      <span>/</span>
      <span>{{ (quiz.questions || []).length }} questions</span>
      <span>/</span>
      <span>{{ quiz.duration }} min</span>
    </div>
    <slot />
  </article>
</template>

<script setup>
defineProps({ quiz: { type: Object, required: true } })
</script>
