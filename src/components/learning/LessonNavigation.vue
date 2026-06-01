<template>
  <div class="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
    <RouterLink
      v-if="previousLesson"
      :to="lessonRoute(previousLesson)"
      class="inline-flex justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
    >
      Previous Lesson
    </RouterLink>
    <span v-else class="hidden sm:block"></span>

    <RouterLink
      v-if="nextLesson"
      :to="lessonRoute(nextLesson)"
      class="inline-flex justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
    >
      Next Lesson
    </RouterLink>
  </div>
</template>

<script setup>
const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  },
  previousLesson: {
    type: Object,
    default: null
  },
  nextLesson: {
    type: Object,
    default: null
  }
})

const lessonRoute = (lesson) => `/learn/${props.courseId}/lessons/${lesson.id}`
</script>
