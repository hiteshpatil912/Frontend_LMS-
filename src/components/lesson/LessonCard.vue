<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Lesson {{ lesson.order }}</p>
        <h3 class="mt-1 text-base font-semibold text-slate-950">{{ lesson.title }}</h3>
        <p class="mt-2 line-clamp-2 text-sm text-slate-500">{{ lesson.description }}</p>
      </div>
      <span class="rounded-full px-2.5 py-1 text-xs font-medium capitalize" :class="lesson.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">{{ lesson.status }}</span>
    </div>
    <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
      <span>{{ lesson.duration }}</span>
      <span>/</span>
      <span>{{ lesson.courseName }}</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  lesson: {
    type: Object,
    required: true
  }
})
</script>
