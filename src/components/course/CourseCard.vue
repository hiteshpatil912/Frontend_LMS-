<template>
  <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="h-40 bg-slate-200">
      <img
        v-if="course.thumbnail"
        class="h-full w-full object-cover"
        :src="course.thumbnail"
        :alt="course.title"
      />
      <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-brand-600 to-slate-900 text-sm font-semibold text-white">
        {{ initials }}
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-4">
        <h3 class="text-base font-semibold text-slate-950">{{ course.title }}</h3>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
          {{ course.status }}
        </span>
      </div>

      <div class="mt-5">
        <div class="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Progress</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="mt-2 h-2 rounded-full bg-slate-100">
          <div class="h-2 rounded-full bg-brand-600" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>

      <RouterLink
        :to="learningRoute"
        class="mt-5 inline-flex w-full justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Continue Learning
      </RouterLink>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  routeBase: {
    type: String,
    default: '/learn'
  }
})

const progress = computed(() => Math.min(100, Math.max(0, Number(props.course.progress || 0))))
const courseSlug = computed(() => props.course.slug || props.course.id || 'course')
const lessonId = computed(() => props.course.nextLessonId || 'intro')
const learningRoute = computed(() => `${props.routeBase}/${courseSlug.value}/lessons/${lessonId.value}`)
const initials = computed(() =>
  String(props.course.title || 'Course')
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
)
</script>
