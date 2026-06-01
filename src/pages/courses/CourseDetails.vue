<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div
      v-if="details.error || progress.error || wishlist.error"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ details.error?.message || progress.error?.message || wishlist.error?.message }}
    </div>

    <div
      v-if="wishlist.message"
      class="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
    >
      {{ wishlist.message }}
    </div>

    <div v-if="details.loading" class="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div class="space-y-4">
        <div class="h-8 w-2/3 animate-pulse rounded bg-slate-200"></div>
        <div class="h-4 w-full max-w-2xl animate-pulse rounded bg-slate-100"></div>
        <div class="h-4 w-3/4 max-w-2xl animate-pulse rounded bg-slate-100"></div>
      </div>
      <div class="h-72 animate-pulse rounded-lg bg-slate-200"></div>
    </div>

    <template v-else-if="details.course">
      <div class="grid gap-8 lg:grid-cols-[1fr_360px]">
        <article>
          <div class="overflow-hidden rounded-lg bg-slate-200">
            <img
              v-if="details.course.thumbnail"
              :src="details.course.thumbnail"
              :alt="details.course.title"
              class="aspect-video w-full object-cover"
            />
            <div v-else class="flex aspect-video items-center justify-center bg-gradient-to-br from-brand-600 to-slate-900 text-lg font-semibold text-white">
              Course Preview
            </div>
          </div>

          <div class="mt-8">
            <p class="text-sm font-medium text-brand-700">Course Details</p>
            <h1 class="mt-2 text-3xl font-semibold text-slate-950">{{ details.course.title }}</h1>
            <p class="mt-4 max-w-3xl text-slate-600">{{ details.course.description }}</p>
          </div>
        </article>

        <aside class="h-max rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <dl class="space-y-4 text-sm">
            <div>
              <dt class="text-slate-500">Instructor</dt>
              <dd class="mt-1 font-medium text-slate-950">{{ details.course.instructor }}</dd>
            </div>
            <div>
              <dt class="text-slate-500">Total Lessons</dt>
              <dd class="mt-1 font-medium text-slate-950">{{ details.totalLessons }}</dd>
            </div>
            <div>
              <dt class="text-slate-500">Completed Lessons</dt>
              <dd class="mt-1 font-medium text-slate-950">
                {{ currentProgress.completedLessons }} / {{ currentProgress.totalLessons || details.totalLessons }}
              </dd>
            </div>
          </dl>

          <ProgressBar class="mt-5" :value="currentProgress.percentage || details.course.progressPercentage" />

          <RouterLink
            :to="firstLessonRoute"
            class="mt-5 inline-flex w-full justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Start Learning
          </RouterLink>

          <button
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="wishlist.adding"
            @click="addToWishlist"
          >
            {{ wishlist.adding ? 'Adding...' : 'Add To Wishlist' }}
          </button>
        </aside>
      </div>

      <section class="mt-10">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-950">Lessons</h2>
          <span class="text-sm text-slate-500">{{ details.totalLessons }} lessons</span>
        </div>

        <div v-if="details.lessonsLoading" class="space-y-3">
          <div v-for="item in 5" :key="item" class="h-14 animate-pulse rounded-lg bg-white"></div>
        </div>

        <div v-else class="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <RouterLink
            v-for="lesson in details.sortedLessons"
            :key="lesson.id"
            :to="`/learn/${courseId}/lessons/${lesson.id}`"
            class="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0 hover:bg-slate-50"
          >
            <span class="font-medium text-slate-800">{{ lesson.title }}</span>
            <span
              class="rounded-full px-3 py-1 text-xs font-medium"
              :class="lesson.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
            >
              {{ lesson.completed ? 'Completed' : 'Open' }}
            </span>
          </RouterLink>
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProgressBar from '@/components/learning/ProgressBar.vue'
import { useLmsCourseDetailsStore } from '@/stores/lms/courseDetailsStore'
import { useLmsProgressStore } from '@/stores/lms/progressStore'
import { useLmsWishlistStore } from '@/stores/lms/wishlistStore'

const route = useRoute()
const details = useLmsCourseDetailsStore()
const progress = useLmsProgressStore()
const wishlist = useLmsWishlistStore()

const courseId = computed(() => route.params.slug)
const currentProgress = computed(() => progress.forCourse(courseId.value))
const firstLessonRoute = computed(() => {
  const lesson = details.sortedLessons[0]
  return lesson ? `/learn/${courseId.value}/lessons/${lesson.id}` : `/learn/${courseId.value}`
})

const loadCourse = async () => {
  try {
    await details.fetchCourseDetails(courseId.value)
    await progress.fetchProgress(courseId.value)
  } catch {
    // Stores own rendered error state.
  }
}

const addToWishlist = async () => {
  try {
    await wishlist.addToWishlist(courseId.value)
  } catch {
    // Store owns the rendered error state.
  }
}

onMounted(loadCourse)
watch(courseId, loadCourse)
</script>
