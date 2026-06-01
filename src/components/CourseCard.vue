<template>
  <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="h-32 bg-gradient-to-br from-sky-500 via-indigo-500 to-cyan-400"></div>
    <div class="p-5">
      <div class="flex items-center justify-between gap-3">
        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{{ course.level }}</span>
        <span class="text-sm font-semibold text-slate-950">{{ course.price }}</span>
      </div>
      <h3 class="mt-4 text-base font-semibold text-slate-950">{{ course.title }}</h3>
      <p class="mt-2 text-sm text-slate-500">{{ course.description }}</p>
      <div class="mt-5 flex items-center justify-between text-sm text-slate-600">
        <span>{{ course.lessons }} lessons</span>
        <span>{{ course.students }} students</span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
})
</script>
