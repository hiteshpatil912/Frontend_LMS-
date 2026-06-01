<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-950">My Courses</h1>
        <p class="mt-1 text-sm text-slate-500">Continue from your enrolled courses.</p>
      </div>

      <button
        type="button"
        class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="myCourses.loading"
        @click="loadCourses(myCourses.pagination.currentPage)"
      >
        Refresh
      </button>
    </div>

    <div
      v-if="myCourses.error"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ myCourses.error.message }}
    </div>

    <div v-if="myCourses.loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in 6" :key="item" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="h-40 animate-pulse bg-slate-200"></div>
        <div class="space-y-4 p-5">
          <div class="h-5 w-3/4 animate-pulse rounded bg-slate-200"></div>
          <div class="h-2 w-full animate-pulse rounded bg-slate-100"></div>
          <div class="h-10 w-full animate-pulse rounded bg-slate-200"></div>
        </div>
      </article>
    </div>

    <div v-else-if="myCourses.hasCourses" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <CourseCard
        v-for="course in myCourses.courses"
        :key="course.id"
        :course="course"
      />
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No enrolled courses found.
    </div>

    <nav
      v-if="myCourses.hasPagination"
      class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Course pagination"
    >
      <p class="text-sm text-slate-500">
        Page {{ myCourses.pagination.currentPage }} of {{ myCourses.pagination.lastPage }}
      </p>

      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="myCourses.loading || myCourses.pagination.currentPage <= 1"
          @click="loadCourses(myCourses.pagination.currentPage - 1)"
        >
          Previous
        </button>

        <button
          type="button"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="myCourses.loading || myCourses.pagination.currentPage >= myCourses.pagination.lastPage"
          @click="loadCourses(myCourses.pagination.currentPage + 1)"
        >
          Next
        </button>
      </div>
    </nav>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import CourseCard from '@/components/course/CourseCard.vue'
import { useLmsMyCoursesStore } from '@/stores/lms/myCoursesStore'

const myCourses = useLmsMyCoursesStore()

const loadCourses = async (page = 1) => {
  try {
    await myCourses.fetchCourses(page)
  } catch {
    // The store owns the rendered error state.
  }
}

onMounted(() => loadCourses())
</script>
