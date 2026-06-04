<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Resources</h1>
      <p class="mt-1 text-sm text-slate-500">Organize course files and downloadable learning material.</p>
    </div>

    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="space-y-3 p-5">
        <div v-for="item in 5" :key="item" class="h-10 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>

    <DataTable v-else-if="resources.length" :columns="columns" :rows="resources">
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

    <div v-else-if="!error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No resources found.
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import { teacherResourceService } from '@/services/teacherResourceService'

const resources = ref([])
const loading = ref(false)
const error = ref('')

const columns = [
  { key: 'title', label: 'Resource' },
  { key: 'course', label: 'Course' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
  { key: 'updated', label: 'Updated' },
  { key: 'action', label: 'Action' }
]

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const listFrom = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.resources)) return payload.resources
  if (Array.isArray(payload.data)) return payload.data
  return []
}

const formatDate = (value) => {
  if (!value) return 'Not available'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString().slice(0, 10)
}

const fileTypeFrom = (fileUrl) => {
  const extension = String(fileUrl || '').split('?')[0].split('.').pop()
  return extension && extension !== fileUrl ? extension.toUpperCase() : 'File'
}

const normalizeResource = (resource) => ({
  id: resource.id,
  title: resource.title || 'Untitled Resource',
  course: resource.course_title || `Course #${resource.course_id}`,
  type: resource.type || fileTypeFrom(resource.file_url),
  size: resource.size || 'Not available',
  updated: formatDate(resource.created_at),
  url: resource.file_url || '#'
})

const loadResources = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await teacherResourceService.getResources()
    resources.value = listFrom(unwrap(response)).map(normalizeResource)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load resources.'
    resources.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadResources)
</script>
