<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Analytics</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Analytics Dashboard</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Monitor revenue, learning activity, enrollments, instructors, courses, and quiz outcomes.</p>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div v-if="store.loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="item in 8" :key="item" class="h-32 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalyticsCard v-for="card in store.summaryCards" :key="card.label" v-bind="card" />
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <RevenueChart :rows="store.revenueStats.monthly" />
      <StudentGrowthChart :rows="store.studentStats.growth" />
      <EnrollmentChart :rows="store.studentStats.enrollmentStats" />
      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-base font-semibold text-slate-950">Quiz performance</h3>
        <div class="mt-5 h-72">
          <Pie :data="quizChartData" :options="chartOptions" />
        </div>
      </section>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div class="grid gap-6 lg:grid-cols-2">
        <TopCoursesTable :rows="store.courseStats.topCourses" />
        <TopTeachersTable :rows="store.courseStats.topTeachers" />
      </div>
      <ActivityTimeline :rows="store.courseStats.recentActivities" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import ActivityTimeline from '@/components/admin/ActivityTimeline.vue'
import AnalyticsCard from '@/components/admin/AnalyticsCard.vue'
import EnrollmentChart from '@/components/admin/EnrollmentChart.vue'
import RevenueChart from '@/components/admin/RevenueChart.vue'
import StudentGrowthChart from '@/components/admin/StudentGrowthChart.vue'
import TopCoursesTable from '@/components/admin/TopCoursesTable.vue'
import TopTeachersTable from '@/components/admin/TopTeachersTable.vue'
import { chartOptions } from '@/components/admin/chartSetup'
import { useAdminAnalyticsStore } from '@/stores/admin/analyticsStore'

const store = useAdminAnalyticsStore()

const quizChartData = computed(() => ({
  labels: store.courseStats.quizPerformance.map((row) => row.label),
  datasets: [
    {
      data: store.courseStats.quizPerformance.map((row) => row.value),
      backgroundColor: ['#16a34a', '#dc2626', '#f59e0b']
    }
  ]
}))

onMounted(() => {
  store.fetchAllAnalytics()
})
</script>
