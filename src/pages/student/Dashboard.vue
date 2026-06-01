<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Student workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Learning Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500">Track your course momentum, certificates, and next learning steps.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="dashboard.loading"
        @click="loadDashboard"
      >
        Refresh
      </button>
    </div>

    <div
      v-if="dashboard.error"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ dashboard.error.message }}
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-if="dashboard.loading"
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

    <div class="grid gap-6 xl:grid-cols-[1fr_380px]">
      <ChartContainer title="Weekly study rhythm" :bars="bars" />

      <DataTable :columns="columns" :rows="learningRows">
        <template #status="{ row }">
          <span
            class="rounded-full px-2.5 py-1 text-xs font-medium"
            :class="row.status === 'Ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
          >
            {{ row.status }}
          </span>
        </template>
      </DataTable>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-950">Continue Learning</h2>
          <RouterLink to="/student/my-courses" class="text-sm font-medium text-brand-700">
            View Courses
          </RouterLink>
        </div>

        <div v-if="dashboard.loading" class="grid gap-4 md:grid-cols-2">
          <ContinueLearningCard v-for="item in 2" :key="item" loading />
        </div>

        <div v-else-if="dashboard.continueLearning.length" class="grid gap-4 md:grid-cols-2">
          <ContinueLearningCard
            v-for="item in dashboard.continueLearning"
            :key="item.id || item.course_id || item.course?.id"
            :item="item"
          />
        </div>

        <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No active learning item yet.
        </div>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-base font-semibold text-slate-950">Recent Notifications</h2>

        <div v-if="dashboard.loading" class="mt-5 space-y-4">
          <div v-for="item in 4" :key="item" class="animate-pulse space-y-2">
            <div class="h-4 w-3/4 rounded bg-slate-200"></div>
            <div class="h-3 w-1/2 rounded bg-slate-100"></div>
          </div>
        </div>

        <ul v-else-if="dashboard.recentNotifications.length" class="mt-5 divide-y divide-slate-100">
          <li
            v-for="notification in dashboard.recentNotifications"
            :key="notification.id"
            class="py-3"
          >
            <p class="text-sm font-medium text-slate-800">
              {{ notification.title || notification.message || notification.data?.title || 'Notification' }}
            </p>
            <p v-if="notification.created_at" class="mt-1 text-xs text-slate-500">
              {{ formatDate(notification.created_at) }}
            </p>
          </li>
        </ul>

        <p v-else class="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No notifications yet.
        </p>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import {
  AcademicCapIcon,
  CheckBadgeIcon,
  ChartPieIcon,
  PlayCircleIcon
} from '@heroicons/vue/24/outline'
import ChartContainer from '@/components/ChartContainer.vue'
import ContinueLearningCard from '@/components/student/ContinueLearningCard.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { useLmsDashboardStore } from '@/stores/lms/dashboardStore'

const dashboard = useLmsDashboardStore()

const metrics = computed(() => [
  {
    label: 'Enrolled courses',
    value: dashboard.totals.enrolledCourses,
    trend: 'Synced from Laravel LMS',
    icon: AcademicCapIcon
  },
  {
    label: 'Completed courses',
    value: dashboard.totals.completedCourses,
    trend: 'Eligible for certificates',
    icon: CheckBadgeIcon
  },
  {
    label: 'Active courses',
    value: dashboard.totals.activeCourses,
    trend: 'Currently underway',
    icon: PlayCircleIcon
  },
  {
    label: 'Certificates',
    value: dashboard.totals.certificatesEarned,
    trend: 'Earned credentials',
    icon: ChartPieIcon
  }
])

const columns = [
  { key: 'title', label: 'Lesson' },
  { key: 'course', label: 'Course' },
  { key: 'status', label: 'Status' }
]

const bars = [
  { label: 'M', value: 40 },
  { label: 'T', value: 62 },
  { label: 'W', value: 55 },
  { label: 'T', value: 76 },
  { label: 'F', value: 71 },
  { label: 'S', value: 44 },
  { label: 'S', value: 59 }
]

const learningRows = computed(() => {
  if (!dashboard.continueLearning.length) {
    return [
      { id: 'empty', title: 'No lesson queued', course: 'Start a course', status: 'Open' }
    ]
  }

  return dashboard.continueLearning.slice(0, 5).map((item, index) => {
    const course = item.course || item

    return {
      id: item.id || item.course_id || index,
      title: item.lesson_title || item.lesson?.title || item.next_lesson_title || 'Continue lesson',
      course: course.title || course.name || item.course_title || 'Course',
      status: 'Ready'
    }
  })
})

const loadDashboard = async () => {
  try {
    await dashboard.fetchDashboard()
  } catch {
    // The store owns the rendered error state.
  }
}

const formatDate = (value) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

onMounted(loadDashboard)
</script>
