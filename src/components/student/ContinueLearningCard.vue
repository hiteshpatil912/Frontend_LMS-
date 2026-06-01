<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-4 w-24 rounded bg-slate-200"></div>
      <div class="h-6 w-3/4 rounded bg-slate-200"></div>
      <div class="h-2 w-full rounded bg-slate-200"></div>
      <div class="h-10 w-36 rounded bg-slate-200"></div>
    </div>

    <template v-else>
      <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">Continue Learning</p>
      <h3 class="mt-2 text-lg font-semibold text-slate-950">{{ title }}</h3>
      <p v-if="lessonTitle" class="mt-1 text-sm text-slate-500">{{ lessonTitle }}</p>

      <div class="mt-4">
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
        class="mt-5 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Continue
      </RouterLink>
    </template>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const course = computed(() => props.item.course || props.item)
const title = computed(() => course.value.title || course.value.name || props.item.course_title || 'Course')
const lessonTitle = computed(() => props.item.lesson_title || props.item.lesson?.title || props.item.next_lesson_title || '')
const progress = computed(() => Math.min(100, Math.max(0, Number(props.item.progress_percentage ?? props.item.progress ?? course.value.progress ?? 0))))
const courseSlug = computed(() => course.value.slug || props.item.course_slug || course.value.id || props.item.course_id || 'course')
const lessonId = computed(() => props.item.lesson_id || props.item.next_lesson_id || props.item.nextLessonId || 'intro')
const learningRoute = computed(() => `/learn/${courseSlug.value}/lessons/${lessonId.value}`)
</script>
