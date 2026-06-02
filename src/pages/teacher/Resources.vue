<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Resources</h1>
      <p class="mt-1 text-sm text-slate-500">Organize course files and downloadable learning material.</p>
    </div>

    <DataTable v-if="resources.length" :columns="columns" :rows="resources">
      <template #size="{ row }">
        <span class="font-medium text-slate-700">{{ row.size }}</span>
      </template>
      <template #action="{ row }">
        <a
          class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          :href="row.url"
          download
        >
          Download
        </a>
      </template>
    </DataTable>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No resources found.
    </div>
  </section>
</template>

<script setup>
import DataTable from '@/components/DataTable.vue'

const resources = [
  { id: 1, title: 'Vue Setup Guide', course: 'Vue Foundations', type: 'PDF', size: '1.4 MB', updated: '2026-05-24', url: '#' },
  { id: 2, title: 'API Testing Collection', course: 'Laravel API LMS', type: 'JSON', size: '820 KB', updated: '2026-05-27', url: '#' },
  { id: 3, title: 'Pinia Exercise Notes', course: 'Pinia State Management', type: 'PDF', size: '960 KB', updated: '2026-05-30', url: '#' }
]

const columns = [
  { key: 'title', label: 'Resource' },
  { key: 'course', label: 'Course' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
  { key: 'updated', label: 'Updated' },
  { key: 'action', label: 'Action' }
]
</script>
