<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Assignments</h1>
      <p class="mt-1 text-sm text-slate-500">Track assignment activity, submissions, and review status.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in metrics" :key="metric.label" v-bind="metric" />
    </div>

    <DataTable v-if="assignments.length" :columns="columns" :rows="assignments">
      <template #submissions="{ row }">
        <span class="font-medium text-slate-700">{{ row.submissions }}</span>
      </template>
      <template #status="{ row }">
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass(row.status)">
          {{ row.status }}
        </span>
      </template>
      <template #actions>
        <button
          type="button"
          class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View
        </button>
      </template>
    </DataTable>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No assignments found.
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { CheckBadgeIcon, ClipboardDocumentListIcon, ClockIcon, InboxStackIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'

const assignments = [
  {
    id: 1,
    title: 'Vue Component Practice',
    course: 'Vue Foundations',
    dueDate: '2026-06-08',
    submissions: '18 / 24',
    status: 'Pending Review'
  },
  {
    id: 2,
    title: 'Laravel API Worksheet',
    course: 'Laravel API LMS',
    dueDate: '2026-06-10',
    submissions: '12 / 18',
    status: 'Submitted'
  },
  {
    id: 3,
    title: 'Pinia Store Refactor',
    course: 'Pinia State Management',
    dueDate: '2026-06-12',
    submissions: '21 / 21',
    status: 'Completed'
  }
]

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'course', label: 'Course' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'submissions', label: 'Submissions' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const metrics = computed(() => [
  { label: 'Total Assignments', value: assignments.length, trend: 'Mock assignment data', icon: ClipboardDocumentListIcon },
  { label: 'Pending Review', value: countByStatus('Pending Review'), trend: 'Needs teacher review', icon: ClockIcon, tone: 'negative' },
  { label: 'Submitted', value: countByStatus('Submitted'), trend: 'Awaiting completion', icon: InboxStackIcon },
  { label: 'Completed', value: countByStatus('Completed'), trend: 'Finished assignments', icon: CheckBadgeIcon }
])

const countByStatus = (status) => assignments.filter((assignment) => assignment.status === status).length

const statusClass = (status) => {
  const classes = {
    'Pending Review': 'bg-amber-50 text-amber-700',
    Submitted: 'bg-brand-50 text-brand-700',
    Completed: 'bg-emerald-50 text-emerald-700'
  }

  return classes[status] || 'bg-slate-100 text-slate-600'
}
</script>
