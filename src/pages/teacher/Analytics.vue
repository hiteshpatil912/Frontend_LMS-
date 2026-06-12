<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Analytics</h1>
        <p class="mt-1 text-sm text-slate-500">Student progress, enrollments, quiz scores, and course ratings.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="loading || courseLoading"
        @click="loadAnalytics"
      >
        Refresh
      </button>
    </div>

    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-if="loading"
        v-for="item in 4"
        :key="item"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="h-4 w-2/3 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200"></div>
      </article>

      <DashboardCard
        v-else
        v-for="metric in metrics"
        :key="metric.label"
        v-bind="metric"
      />
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_420px]">
      <ChartContainer title="Learning analytics snapshot" :bars="chartBars" />

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-base font-semibold text-slate-950">Course Analytics</h2>
        <p class="mt-1 text-sm text-slate-500">Per-course student progress and engagement.</p>

        <div v-if="courseLoading" class="mt-5 space-y-3">
          <div v-for="item in 4" :key="item" class="h-16 animate-pulse rounded-lg bg-slate-100"></div>
        </div>

        <div v-else-if="courseRows.length" class="mt-5 space-y-3">
          <article
            v-for="course in courseRows"
            :key="course.courseId"
            class="rounded-lg border border-slate-200 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-sm font-semibold text-slate-950">{{ course.courseName }}</h3>
                <p class="mt-1 text-xs text-slate-500">{{ course.totalStudents }} students enrolled</p>
              </div>
              <span class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                {{ course.totalLessons }} lessons
              </span>
            </div>

            <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt class="text-xs text-slate-500">Total Students</dt>
                <dd class="mt-1 font-semibold text-slate-950">{{ course.totalStudents }}</dd>
              </div>
              <div>
                <dt class="text-xs text-slate-500">Total Lessons</dt>
                <dd class="mt-1 font-semibold text-slate-950">{{ course.totalLessons }}</dd>
              </div>
              <div>
                <dt class="text-xs text-slate-500">Total Quizzes</dt>
                <dd class="mt-1 font-semibold text-slate-950">{{ course.totalQuizzes }}</dd>
              </div>
            </dl>
          </article>
        </div>

        <p v-else class="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No course analytics available.
        </p>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import ChartContainer from '@/components/ChartContainer.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { teacherAnalyticsService } from '@/services/teacherAnalyticsService'
import { teacherCourseService } from '@/services/teacherCourseService'

const overview = ref({
  totalStudents: 0,
  totalCourses: 0,
  totalLessons: 0,
  totalQuizzes: 0
})
const courseRows = ref([])
const loading = ref(false)
const courseLoading = ref(false)
const error = ref('')

const metrics = computed(() => [
  {
    label: 'Total Students',
    value: overview.value.totalStudents,
    trend: 'Across your courses',
    icon: UserGroupIcon
  },
  {
    label: 'Total Courses',
    value: overview.value.totalCourses,
    trend: 'Published and draft courses',
    icon: AcademicCapIcon
  },
  {
    label: 'Total Lessons',
    value: overview.value.totalLessons,
    trend: 'Course lesson library',
    icon: ClipboardDocumentListIcon
  },
  {
    label: 'Total Quizzes',
    value: overview.value.totalQuizzes,
    trend: 'Assessment inventory',
    icon: ChartBarIcon
  }
])

const chartBars = computed(() => [
  { label: 'Students', value: overview.value.totalStudents },
  { label: 'Courses', value: overview.value.totalCourses },
  { label: 'Lessons', value: overview.value.totalLessons },
  { label: 'Quizzes', value: overview.value.totalQuizzes }
])

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const listFrom = (payload, key) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.[key])) return payload[key]
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const numberFrom = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null)
  return Number(value || 0)
}

const normalizeOverview = (payload) => ({
  totalStudents: numberFrom(payload.total_students, payload.totalStudents, payload.students_count),
  totalCourses: numberFrom(payload.total_courses, payload.totalCourses, payload.courses_count),
  totalLessons: numberFrom(payload.total_lessons, payload.totalLessons, payload.lessons_count),
  totalQuizzes: numberFrom(payload.total_quizzes, payload.totalQuizzes, payload.quizzes_count)
})

const normalizeCourse = (course) => ({
  id: course.id || course.course_id,
  title: course.title || course.course_title || course.course_name || course.name || 'Untitled Course'
})

const normalizeCourseAnalytics = (payload, course) => ({
  courseId: payload.course_id || payload.id || course.id,
  courseName: payload.course_name || payload.course_title || payload.title || course.title,
  totalStudents: numberFrom(payload.total_students, payload.totalStudents, payload.students_count),
  totalLessons: numberFrom(payload.total_lessons, payload.totalLessons, payload.lessons_count),
  totalQuizzes: numberFrom(payload.total_quizzes, payload.totalQuizzes, payload.quizzes_count)
})

const loadCourseAnalytics = async (overviewPayload) => {
  courseLoading.value = true

  try {
    const overviewCourses = listFrom(overviewPayload, 'courses').map(normalizeCourse)
    let courses = overviewCourses

    if (!courses.length) {
      const response = await teacherCourseService.getCourses()
      courses = listFrom(unwrap(response), 'courses').map(normalizeCourse)
    }

    const rows = await Promise.all(
      courses
        .filter((course) => course.id)
        .map(async (course) => {
          const response = await teacherAnalyticsService.getCourseAnalytics(course.id)
          const payload = unwrap(response)
          return normalizeCourseAnalytics(payload.analytics || payload.course_analytics || payload, course)
        })
    )

    courseRows.value = rows
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load course analytics.'
    courseRows.value = []
  } finally {
    courseLoading.value = false
  }
}

const loadAnalytics = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await teacherAnalyticsService.getDashboardAnalytics()
    const payload = unwrap(response)
    overview.value = normalizeOverview(payload.analytics || payload)
    await loadCourseAnalytics(payload.analytics || payload)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load analytics.'
    overview.value = normalizeOverview({})
    courseRows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadAnalytics)
</script>
