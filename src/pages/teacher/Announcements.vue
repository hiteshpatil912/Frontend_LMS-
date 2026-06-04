<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Announcements</h1>
        <p class="mt-1 text-sm text-slate-500">Manage course updates, reminders, and learner notices.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Create Announcement
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in metrics" :key="metric.label" v-bind="metric" />
    </div>

    <DataTable v-if="announcements.length" :columns="columns" :rows="announcements">
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
      No announcements found.
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { CalendarDaysIcon, CheckBadgeIcon, ClipboardDocumentListIcon, SpeakerWaveIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'

const announcements = [
  {
    id: 1,
    title: 'Live Q&A Session',
    audience: 'Vue Foundations',
    publishDate: '2026-06-06',
    status: 'Published'
  },
  {
    id: 2,
    title: 'API Assignment Reminder',
    audience: 'Laravel API LMS',
    publishDate: '2026-06-08',
    status: 'Scheduled'
  },
  {
    id: 3,
    title: 'Pinia Project Notes',
    audience: 'Pinia State Management',
    publishDate: 'Not published',
    status: 'Draft'
  }
]

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'audience', label: 'Audience' },
  { key: 'publishDate', label: 'Publish Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const metrics = computed(() => [
  { label: 'Total Announcements', value: announcements.length, trend: 'Mock announcement data', icon: SpeakerWaveIcon },
  { label: 'Published', value: countByStatus('Published'), trend: 'Visible to learners', icon: CheckBadgeIcon },
  { label: 'Drafts', value: countByStatus('Draft'), trend: 'Still being prepared', icon: ClipboardDocumentListIcon, tone: 'negative' },
  { label: 'Scheduled', value: countByStatus('Scheduled'), trend: 'Queued for later', icon: CalendarDaysIcon }
])

const countByStatus = (status) => announcements.filter((announcement) => announcement.status === status).length

const statusClass = (status) => {
  const classes = {
    Published: 'bg-emerald-50 text-emerald-700',
    Draft: 'bg-slate-100 text-slate-600',
    Scheduled: 'bg-brand-50 text-brand-700'
  }

  return classes[status] || 'bg-slate-100 text-slate-600'
}
</script>
