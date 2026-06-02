<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Students</h1>
      <p class="mt-1 text-sm text-slate-500">Review learner enrollment and course progress.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in metrics" :key="metric.label" v-bind="metric" />
    </div>

    <DataTable v-if="students.length" :columns="columns" :rows="students">
      <template #progress="{ row }">
        <div class="flex min-w-40 items-center gap-3">
          <div class="h-2 w-24 rounded-full bg-slate-100">
            <div class="h-2 rounded-full bg-brand-600" :style="{ width: `${row.progress}%` }"></div>
          </div>
          <span class="text-sm font-medium text-slate-700">{{ row.progress }}%</span>
        </div>
      </template>
      <template #status="{ row }">
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No students found.
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { AcademicCapIcon, ChartBarIcon, CheckBadgeIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'

const students = [
  { id: 1, name: 'Aarav Khan', email: 'aarav@example.com', course: 'Vue Foundations', progress: 82, status: 'Active' },
  { id: 2, name: 'Mina Patel', email: 'mina@example.com', course: 'Laravel API LMS', progress: 64, status: 'Active' },
  { id: 3, name: 'Riya Das', email: 'riya@example.com', course: 'Pinia State Management', progress: 100, status: 'Completed' }
]

const columns = [
  { key: 'name', label: 'Student' },
  { key: 'email', label: 'Email' },
  { key: 'course', label: 'Course' },
  { key: 'progress', label: 'Progress' },
  { key: 'status', label: 'Status' }
]

const averageProgress = computed(() =>
  students.length ? Math.round(students.reduce((total, student) => total + student.progress, 0) / students.length) : 0
)

const metrics = computed(() => [
  { label: 'Total Students', value: students.length, trend: 'Mock roster data', icon: UserGroupIcon },
  { label: 'Active Learners', value: students.filter((student) => student.status === 'Active').length, trend: 'Currently enrolled', icon: AcademicCapIcon },
  { label: 'Completed', value: students.filter((student) => student.status === 'Completed').length, trend: 'Finished courses', icon: CheckBadgeIcon },
  { label: 'Average Progress', value: `${averageProgress.value}%`, trend: 'Across active courses', icon: ChartBarIcon }
])
</script>
