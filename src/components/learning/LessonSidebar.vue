<template>
  <aside class="border-white/10 bg-slate-900 lg:border-r">
    <div class="border-b border-white/10 p-4 lg:hidden">
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-md bg-white/5 px-3 py-2 text-left text-sm font-medium text-white"
        @click="open = !open"
      >
        <span>Lessons</span>
        <span>{{ open ? 'Hide' : 'Show' }}</span>
      </button>
    </div>

    <div :class="['p-4 lg:block', open ? 'block' : 'hidden']">
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-white">Lessons</h2>
        <p class="mt-1 text-sm text-slate-400">
          {{ completedLessons }} of {{ totalLessons }} completed
        </p>
      </div>

      <ProgressBar :value="progress" dark />

      <div class="mt-5 space-y-2">
        <RouterLink
          v-for="lesson in lessons"
          :key="lesson.id"
          :to="lessonRoute(lesson)"
          class="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
          :class="{ 'bg-white/10 text-white': String(lesson.id) === String(currentLessonId) }"
        >
          <span class="min-w-0 truncate">{{ lesson.title }}</span>
          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-xs"
            :class="lesson.completed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-slate-400'"
          >
            {{ lesson.completed ? 'Done' : 'Open' }}
          </span>
        </RouterLink>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import ProgressBar from '@/components/learning/ProgressBar.vue'

const props = defineProps({
  lessons: {
    type: Array,
    default: () => []
  },
  courseId: {
    type: [String, Number],
    required: true
  },
  currentLessonId: {
    type: [String, Number],
    default: null
  },
  progress: {
    type: Number,
    default: 0
  },
  completedLessons: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 0
  }
})

const open = ref(false)

const lessonRoute = (lesson) => `/learn/${props.courseId}/lessons/${lesson.id}`
</script>
