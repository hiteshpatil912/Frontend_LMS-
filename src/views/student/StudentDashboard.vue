<template>
  <section class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in store.metrics" :key="metric.label" v-bind="metric" :icon="PlayCircleIcon" />
    </div>
    <div class="grid gap-6 xl:grid-cols-[1fr_380px]">
      <ChartContainer title="Weekly study rhythm" :bars="bars" />
      <DataTable :columns="columns" :rows="store.learningPlan" />
    </div>
  </section>
</template>

<script setup>
import { PlayCircleIcon } from '@heroicons/vue/24/outline'
import ChartContainer from '@/components/ChartContainer.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { useStudentDashboardStore } from '@/stores/student/dashboardStore'

const store = useStudentDashboardStore()
const columns = [
  { key: 'title', label: 'Lesson' },
  { key: 'course', label: 'Course' },
  { key: 'status', label: 'Due' }
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
</script>
