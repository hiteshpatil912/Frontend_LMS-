<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500">Overview of your courses, students, lessons, and quizzes.</p>
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

    <div v-if="dashboard.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import {
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  PlayCircleIcon
} from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import { useTeacherPanelDashboardStore } from '@/stores/teacher/panelDashboardStore'

const dashboard = useTeacherPanelDashboardStore()

const icons = [AcademicCapIcon, UserGroupIcon, PlayCircleIcon, QuestionMarkCircleIcon]

const metrics = computed(() =>
  dashboard.metrics.map((metric, index) => ({
    ...metric,
    trend: 'Synced from Laravel LMS',
    icon: icons[index]
  }))
)

const loadDashboard = async () => {
  try {
    await dashboard.fetchDashboard()
  } catch {
    // Store owns the rendered error state.
  }
}

onMounted(loadDashboard)
</script>
