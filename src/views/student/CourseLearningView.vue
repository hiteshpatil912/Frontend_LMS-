<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Course learning</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ course?.title || 'Course' }}</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">{{ course?.description }}</p>
      </div>
      <button v-if="course && !store.isEnrolled(course.id)" class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" type="button" @click="enroll">
        Enroll in course
      </button>
      <RouterLink v-else-if="course" class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" :to="`/student/admin/courses/${course.id}/review`">
        Review course
      </RouterLink>
    </div>

    <div v-if="store.loading" class="h-96 animate-pulse rounded-lg bg-slate-200"></div>
    <div v-else-if="course" class="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section class="space-y-5">
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm">
          <video v-if="activeLesson?.videoUrl" class="aspect-video w-full" :src="activeLesson.videoUrl" controls></video>
          <div v-else class="grid aspect-video place-items-center text-center text-white">
            <div>
              <PlayCircleIcon class="mx-auto size-14 text-white/70" />
              <p class="mt-3 text-lg font-semibold">{{ activeLesson?.title || 'Select a lesson' }}</p>
              <p class="mt-1 text-sm text-slate-300">Video preview area</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-950">{{ activeLesson?.title }}</h3>
              <p class="mt-1 text-sm text-slate-500">{{ activeLesson?.duration }}</p>
            </div>
            <button class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="button" :disabled="!activeLesson || activeLesson.completed || progressStore.loading" @click="completeActiveLesson">
              {{ activeLesson?.completed ? 'Completed' : 'Mark complete' }}
            </button>
          </div>
          <ProgressBar class="mt-5" :value="progress" label="Course progress" />
        </div>
      </section>

      <aside class="space-y-4">
        <LearningStatsCard label="Completed lessons" :value="completedLessons" :caption="`${course.lessons.length} total lessons`" />
        <LessonProgressItem v-for="lesson in course.lessons" :key="lesson.id" :lesson="lesson" @select="selectLesson" />
        <button class="focus-ring w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" @click="selectNextLesson">
          Next lesson
        </button>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { PlayCircleIcon } from '@heroicons/vue/24/outline'
import LearningStatsCard from '@/components/student/LearningStatsCard.vue'
import LessonProgressItem from '@/components/student/LessonProgressItem.vue'
import ProgressBar from '@/components/student/ProgressBar.vue'
import { useStudentContinueLearningStore } from '@/stores/student/continueLearningStore'
import { useStudentEnrolledCourseStore } from '@/stores/student/enrolledCourseStore'
import { useStudentProgressStore } from '@/stores/student/progressStore'
import { useStudentWatchHistoryStore } from '@/stores/student/watchHistoryStore'

const route = useRoute()
const store = useStudentEnrolledCourseStore()
const progressStore = useStudentProgressStore()
const continueStore = useStudentContinueLearningStore()
const historyStore = useStudentWatchHistoryStore()
const activeLesson = ref(null)

const course = computed(() => store.currentCourse)
const progress = computed(() => store.progressPercentage(course.value))
const completedLessons = computed(() => course.value?.lessons.filter((lesson) => lesson.completed).length || 0)

watch(course, (value) => {
  if (!value) return
  const latest = historyStore.historyForCourse(value.id).sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt))[0]
  activeLesson.value =
    value.lessons.find((lesson) => String(lesson.id) === String(latest?.lessonId)) ||
    value.lessons.find((lesson) => !lesson.completed) ||
    value.lessons[0]
})

const saveActiveProgress = async (lesson, completed = false) => {
  if (!lesson || !course.value) return
  await continueStore.saveWatchProgress({
    courseId: course.value.id,
    courseTitle: course.value.title,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    watchedDuration: lesson.duration,
    progress: completed ? 100 : lesson.completed ? 100 : 35,
    completed: completed || lesson.completed
  })
}

const selectLesson = async (lesson) => {
  activeLesson.value = lesson
  await saveActiveProgress(lesson)
}

const enroll = async () => {
  await store.enrollCourse(route.params.id)
  await store.fetchSingleCourse(route.params.id)
}

const completeActiveLesson = async () => {
  if (!activeLesson.value) return
  await progressStore.markLessonComplete(route.params.id, activeLesson.value.id)
  activeLesson.value = course.value.lessons.find((lesson) => String(lesson.id) === String(activeLesson.value.id))
  await saveActiveProgress(activeLesson.value, true)
}

const selectNextLesson = async () => {
  const next = course.value?.lessons.find((lesson) => !lesson.completed)
  if (next) await selectLesson(next)
}

onMounted(async () => {
  await historyStore.fetchWatchHistory()
  await store.fetchSingleCourse(route.params.id)
  progressStore.buildLocalProgress()
  await saveActiveProgress(activeLesson.value)
})
</script>
