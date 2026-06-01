<template>
  <section class="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[320px_1fr]">
    <LessonSidebar
      :lessons="details.sortedLessons"
      :course-id="courseId"
      :current-lesson-id="lessonId"
      :progress="currentProgress.percentage"
      :completed-lessons="currentProgress.completedLessons"
      :total-lessons="currentProgress.totalLessons || details.totalLessons"
    />

    <article class="p-4 sm:p-6 lg:p-8">
      <div
        v-if="details.error || progress.error"
        class="mb-6 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
      >
        {{ details.error?.message || progress.error?.message }}
      </div>

      <div v-if="isLoading" class="space-y-5">
        <div class="aspect-video animate-pulse rounded-lg bg-white/10"></div>
        <div class="h-8 w-2/3 animate-pulse rounded bg-white/10"></div>
        <div class="h-4 w-full max-w-2xl animate-pulse rounded bg-white/10"></div>
      </div>

      <template v-else-if="currentLesson">
        <div class="overflow-hidden rounded-lg bg-black">
          <iframe
            v-if="currentLesson.videoUrl"
            class="aspect-video w-full"
            :src="currentLesson.videoUrl"
            :title="currentLesson.title"
            allowfullscreen
          ></iframe>
          <div v-else class="flex aspect-video items-center justify-center text-sm text-slate-400">
            No video URL available for this lesson.
          </div>
        </div>

        <div class="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
          <section>
            <p class="text-sm text-slate-400">Lesson {{ currentIndex + 1 }} of {{ details.totalLessons }}</p>
            <h1 class="mt-1 text-2xl font-semibold text-white">{{ currentLesson.title }}</h1>
            <p class="mt-3 max-w-3xl text-slate-300">{{ currentLesson.description }}</p>

            <div v-if="currentLesson.pdfNotes" class="mt-5">
              <a
                :href="currentLesson.pdfNotes"
                target="_blank"
                rel="noreferrer"
                class="inline-flex rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                Open PDF Notes
              </a>
            </div>

            <LessonNavigation
              class="mt-8"
              :course-id="courseId"
              :previous-lesson="previousLesson"
              :next-lesson="nextLesson"
            />
          </section>

          <aside class="h-max rounded-lg border border-white/10 bg-white/5 p-5">
            <ProgressBar :value="currentProgress.percentage" dark />
            <p class="mt-3 text-sm text-slate-400">
              {{ currentProgress.completedLessons }} of {{ currentProgress.totalLessons || details.totalLessons }} lessons completed
            </p>

            <button
              type="button"
              class="mt-5 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="progress.completing || currentLesson.completed"
              @click="markComplete"
            >
              {{ currentLesson.completed ? 'Completed' : progress.completing ? 'Saving...' : 'Mark As Complete' }}
            </button>
          </aside>
        </div>
      </template>

      <div v-else class="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300">
        Lesson not found.
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LessonNavigation from '@/components/learning/LessonNavigation.vue'
import LessonSidebar from '@/components/learning/LessonSidebar.vue'
import ProgressBar from '@/components/learning/ProgressBar.vue'
import { useLmsCourseDetailsStore } from '@/stores/lms/courseDetailsStore'
import { useLmsProgressStore } from '@/stores/lms/progressStore'

const route = useRoute()
const router = useRouter()
const details = useLmsCourseDetailsStore()
const progress = useLmsProgressStore()

const courseId = computed(() => route.params.courseSlug)
const lessonId = computed(() => route.params.lessonId)
const currentProgress = computed(() => progress.forCourse(courseId.value))
const currentLesson = computed(() => details.lessonById(lessonId.value))
const currentIndex = computed(() => details.lessonIndex(lessonId.value))
const previousLesson = computed(() => details.previousLesson(lessonId.value))
const nextLesson = computed(() => details.nextLesson(lessonId.value))
const isLoading = computed(() => details.loading || details.lessonsLoading || progress.loading)

const loadLessonPage = async () => {
  try {
    await details.fetchCourseDetails(courseId.value)
    await progress.fetchProgress(courseId.value)

    if (lessonId.value === 'intro' && details.sortedLessons[0]) {
      await router.replace(`/learn/${courseId.value}/lessons/${details.sortedLessons[0].id}`)
    }
  } catch {
    // Stores own rendered error state.
  }
}

const markComplete = async () => {
  try {
    await progress.completeLesson(courseId.value, lessonId.value)
  } catch {
    // Store owns rendered error state.
  }
}

onMounted(loadLessonPage)
watch(courseId, loadLessonPage)
</script>
