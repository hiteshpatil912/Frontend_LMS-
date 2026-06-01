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
        :disabled="analytics.loading || analytics.courseLoading"
        @click="loadAnalytics"
      >
        Refresh
      </button>
    </div>

    <div v-if="analytics.error || courses.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ analytics.error?.message || courses.error?.message }}
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <article
        v-if="analytics.loading"
        v-for="item in 5"
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
      <ChartContainer title="Learning analytics snapshot" :bars="analytics.chartBars" />

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-base font-semibold text-slate-950">Course Analytics</h2>
        <p class="mt-1 text-sm text-slate-500">Per-course student progress and engagement.</p>

        <div v-if="courses.loading || analytics.courseLoading" class="mt-5 space-y-3">
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
                <h3 class="text-sm font-semibold text-slate-950">{{ course.courseTitle }}</h3>
                <p class="mt-1 text-xs text-slate-500">{{ course.studentsEnrolled }} students enrolled</p>
              </div>
              <span class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                {{ course.completionPercentage }}%
              </span>
            </div>

            <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt class="text-xs text-slate-500">Quiz Attempts</dt>
                <dd class="mt-1 font-semibold text-slate-950">{{ course.quizAttempts }}</dd>
              </div>
              <div>
                <dt class="text-xs text-slate-500">Average Rating</dt>
                <dd class="mt-1 font-semibold text-slate-950">{{ course.averageRating }}</dd>
              </div>
              <div>
                <dt class="text-xs text-slate-500">Completion</dt>
                <dd class="mt-1 font-semibold text-slate-950">{{ course.completionPercentage }}%</dd>
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
import { computed, onMounted } from 'vue'
import {
  AcademicCapIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import ChartContainer from '@/components/ChartContainer.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { useTeacherPanelAnalyticsStore } from '@/stores/teacher/panelAnalyticsStore'
import { useTeacherPanelCourseStore } from '@/stores/teacher/panelCourseStore'

const analytics = useTeacherPanelAnalyticsStore()
const courses = useTeacherPanelCourseStore()

const metrics = computed(() => [
  {
    label: 'Total Students',
    value: analytics.analytics.totalStudents,
    trend: 'Across your courses',
    icon: UserGroupIcon
  },
  {
    label: 'Total Enrollments',
    value: analytics.analytics.totalEnrollments,
    trend: 'All-time enrollments',
    icon: AcademicCapIcon
  },
  {
    label: 'Completed Courses',
    value: analytics.analytics.completedCourses,
    trend: 'Course completions',
    icon: CheckBadgeIcon
  },
  {
    label: 'Avg Quiz Score',
    value: `${analytics.analytics.averageQuizScore}%`,
    trend: 'Learner performance',
    icon: ChartBarIcon
  },
  {
    label: 'Avg Rating',
    value: analytics.analytics.averageCourseRating,
    trend: 'Course feedback',
    icon: StarIcon
  }
])

const courseRows = computed(() =>
  courses.courses.map((course) => {
    const found = analytics.courseAnalytics.find((item) => String(item.courseId) === String(course.id))

    return found || {
      courseId: course.id,
      courseTitle: course.title,
      studentsEnrolled: 0,
      completionPercentage: 0,
      quizAttempts: 0,
      averageRating: 0
    }
  })
)

const loadAnalytics = async () => {
  try {
    await Promise.all([
      analytics.fetchDashboardAnalytics(),
      courses.fetchCourses()
    ])

    await Promise.all(
      courses.courses.map((course) =>
        analytics.fetchCourseAnalytics(course.id).catch(() => null)
      )
    )
  } catch {
    // Stores own rendered error states.
  }
}

onMounted(loadAnalytics)
</script>
