<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Discussions</h1>
        <p class="mt-1 text-sm text-slate-500">Monitor course conversations and learner questions.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        New Discussion
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in metrics" :key="metric.label" v-bind="metric" />
    </div>

    <DataTable v-if="discussions.length" :columns="columns" :rows="discussions">
      <template #topic="{ row }">
        <span class="font-semibold text-slate-950">{{ row.topic }}</span>
      </template>
      <template #replies="{ row }">
        <span class="font-medium text-slate-700">{{ row.replies }}</span>
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
      No discussions found.
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ChatBubbleLeftRightIcon, CheckBadgeIcon, ClockIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'

const discussions = [
  {
    id: 1,
    topic: 'How should I structure reusable Vue components?',
    course: 'Vue Foundations',
    replies: 12,
    lastActivity: '2026-06-03',
    status: 'Active',
    isNewThisWeek: true
  },
  {
    id: 2,
    topic: 'API token refresh flow question',
    course: 'Laravel API LMS',
    replies: 8,
    lastActivity: '2026-06-02',
    status: 'Resolved',
    isNewThisWeek: true
  },
  {
    id: 3,
    topic: 'Pinia getters vs computed properties',
    course: 'Pinia State Management',
    replies: 5,
    lastActivity: '2026-05-30',
    status: 'Active',
    isNewThisWeek: false
  }
]

const columns = [
  { key: 'topic', label: 'Topic' },
  { key: 'course', label: 'Course' },
  { key: 'replies', label: 'Replies' },
  { key: 'lastActivity', label: 'Last Activity' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const metrics = computed(() => [
  { label: 'Total Discussions', value: discussions.length, trend: 'Mock discussion data', icon: ChatBubbleLeftRightIcon },
  { label: 'Active Discussions', value: countByStatus('Active'), trend: 'Open conversations', icon: ClockIcon },
  { label: 'Resolved Discussions', value: countByStatus('Resolved'), trend: 'Answered topics', icon: CheckBadgeIcon },
  { label: 'New This Week', value: discussions.filter((discussion) => discussion.isNewThisWeek).length, trend: 'Recently started', icon: SparklesIcon }
])

const countByStatus = (status) => discussions.filter((discussion) => discussion.status === status).length

const statusClass = (status) => {
  const classes = {
    Active: 'bg-brand-50 text-brand-700',
    Resolved: 'bg-emerald-50 text-emerald-700'
  }

  return classes[status] || 'bg-slate-100 text-slate-600'
}
</script>
