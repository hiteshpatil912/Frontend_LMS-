<template>
  <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="relative h-56 bg-gradient-to-br from-sky-500 via-indigo-500 to-cyan-400">
      <img v-if="course.thumbnail" class="h-full w-full object-cover" :src="course.thumbnail" :alt="course.title" />
      <CourseStatusBadge class="absolute right-4 top-4" :status="course.status" />
    </div>
    <div class="p-5">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-slate-950">{{ course.title }}</h2>
          <p class="mt-2 text-sm text-slate-500">{{ course.shortDescription || course.description }}</p>
        </div>
        <p class="text-2xl font-semibold text-slate-950">${{ course.price }}</p>
      </div>

      <dl class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="item in details" :key="item.label" class="rounded-lg bg-slate-50 p-4">
          <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ item.label }}</dt>
          <dd class="mt-1 text-sm font-semibold text-slate-950">{{ item.value }}</dd>
        </div>
      </dl>

      <div class="mt-6">
        <h3 class="text-sm font-semibold text-slate-950">Full description</h3>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ course.fullDescription }}</p>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import CourseStatusBadge from '@/components/course/CourseStatusBadge.vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const details = computed(() => [
  { label: 'Instructor', value: props.course.instructor },
  { label: 'Category', value: props.course.category },
  { label: 'Duration', value: props.course.duration },
  { label: 'Level', value: props.course.level },
  { label: 'Created date', value: props.course.createdAt || 'Not available' },
  { label: 'Slug', value: props.course.slug }
])
</script>
