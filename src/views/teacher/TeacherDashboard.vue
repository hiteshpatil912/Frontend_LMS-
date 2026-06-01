<template>
  <section class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in store.metrics" :key="metric.label" v-bind="metric" :icon="UserGroupIcon" />
    </div>
    <div class="grid gap-6 xl:grid-cols-[1fr_380px]">
      <ChartContainer title="Student engagement" :bars="bars" />
      <DataTable :columns="columns" :rows="store.cohorts" />
    </div>
  </section>
</template>

<script setup>
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import ChartContainer from '@/components/ChartContainer.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { useTeacherDashboardStore } from '@/stores/teacher/dashboardStore'

const store = useTeacherDashboardStore()
const columns = [
  { key: 'name', label: 'Cohort' },
  { key: 'progress', label: 'Progress' },
  { key: 'students', label: 'Students' }
]
const bars = [
  { label: 'M', value: 58 },
  { label: 'T', value: 66 },
  { label: 'W', value: 52 },
  { label: 'T', value: 73 },
  { label: 'F', value: 81 },
  { label: 'S', value: 49 },
  { label: 'S', value: 61 }
]
</script>
