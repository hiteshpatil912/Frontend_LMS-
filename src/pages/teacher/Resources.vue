<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Resources</h1>
        <p class="mt-1 text-sm text-slate-500">Organize course files and downloadable learning material.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="resources.saving"
        @click="openModalForCreate"
      >
        Create Resource
      </button>
    </div>

    <div v-if="resources.loading" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="space-y-3 p-5">
        <div v-for="item in 5" :key="item" class="h-10 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>

    <DataTable v-else-if="resources.resources.length" :columns="columns" :rows="resources.resources">
      <template #description="{ row }">
        <span class="block max-w-xl whitespace-normal text-slate-600">{{ row.description || 'No description available.' }}</span>
      </template>
      <template #fileUrl="{ row }">
        <a
          v-if="row.fileUrl"
          class="break-all font-medium text-brand-700 hover:text-brand-800"
          :href="row.fileUrl"
          target="_blank"
          rel="noreferrer"
        >
          {{ row.fileUrl }}
        </a>
        <span v-else class="text-slate-400">No file URL</span>
      </template>
      <template #actions="{ row }">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="editResource(row)"
          >
            Edit
          </button>
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="resources.deletingId === row.id"
            @click="deleteResource(row.id)"
          >
            {{ resources.deletingId === row.id ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </template>
    </DataTable>

    <div v-else-if="!resources.loading && !resources.error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No resources found.
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div class="w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-soft">
        <div class="border-b border-slate-100 p-5">
          <h2 class="text-lg font-semibold text-slate-950">{{ editingId ? 'Edit Resource' : 'Create Resource' }}</h2>
          <p class="mt-1 text-sm text-slate-500">Add a title, description, and file link.</p>
        </div>

        <form class="space-y-4 p-5" @submit.prevent="saveResource">
          <label class="block">
            <span class="text-sm font-medium text-slate-700">Select Course</span>
            <select v-model="selectedCourseId" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="" disabled v-if="coursesLoading">Loading courses...</option>
              <option value="">Select course</option>
              <option v-for="course in courseStore.courses" :key="course.id" :value="course.id">{{ course.title }}</option>
            </select>
            <p v-if="coursesLoading" class="mt-1 text-sm text-slate-500">Loading courses...</p>
            <p v-else-if="!coursesLoading && courseStore.courses.length === 0" class="mt-1 text-sm text-slate-500">No courses available</p>
            <p v-if="fieldError('course_id')" class="mt-1 text-sm text-rose-600">{{ fieldError('course_id') }}</p>
          </label>

          <label class="block">
            <span class="text-sm font-medium text-slate-700">Title</span>
            <input
              v-model.trim="form.title"
              class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              type="text"
              required
            />
            <p v-if="fieldError('title')" class="mt-1 text-sm text-rose-600">{{ fieldError('title') }}</p>
          </label>

          <label class="block">
            <span class="text-sm font-medium text-slate-700">Description</span>
            <textarea
              v-model.trim="form.description"
              class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            ></textarea>
            <p v-if="fieldError('description')" class="mt-1 text-sm text-rose-600">{{ fieldError('description') }}</p>
          </label>

          <label class="block">
            <span class="text-sm font-medium text-slate-700">File URL</span>
            <input
              v-model.trim="form.file_url"
              class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              type="url"
              placeholder="https://example.com/resource.pdf"
              required
            />
            <p v-if="fieldError('file_url')" class="mt-1 text-sm text-rose-600">{{ fieldError('file_url') }}</p>
          </label>

          <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="resources.saving"
            >
              {{ resources.saving ? 'Saving...' : editingId ? 'Update Resource' : 'Create Resource' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import { useTeacherPanelResourceStore } from '@/stores/teacher/panelResourceStore'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'

const resources = useTeacherPanelResourceStore()
const modalOpen = ref(false)
const editingId = ref(null)

const form = reactive({
  title: '',
  description: '',
  file_url: '',
  course_id: ''
})

const courseStore = useTeacherCourseStore()
const selectedCourseId = ref('')
const coursesLoading = ref(false)

const columns = [
  { key: 'title', label: 'Resource Title' },
  { key: 'description', label: 'Description' },
  { key: 'fileUrl', label: 'File URL / Link' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'actions', label: 'Actions' }
]

const fieldError = (field) => {
  const value = resources.error?.validation?.[field]
  return Array.isArray(value) ? value[0] : value
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.file_url = ''
  editingId.value = null
  form.course_id = ''
  selectedCourseId.value = ''
  resources.clearError()
}

const openCreateModal = () => {
  resetForm()
  modalOpen.value = true
}

const editResource = (resource) => {
  editingId.value = resource.id
  form.title = resource.title
  form.description = resource.description
  form.file_url = resource.fileUrl
  // preselect course if available on resource raw
  form.course_id = resource.raw?.course_id || resource.raw?.courseId || ''
  selectedCourseId.value = form.course_id
  resources.clearError()
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  resetForm()
}

const payloadFromForm = () => ({
  title: form.title,
  description: form.description,
  file_url: form.file_url
})

const saveResource = async () => {
  try {
    if (editingId.value) {
      await resources.updateResource(editingId.value, payloadFromForm())
    } else {
      const courseId = selectedCourseId.value || form.course_id
      await resources.createResource(courseId, payloadFromForm())
    }

    closeModal()
  } catch {
    // Store owns rendered error state.
  }
}

const deleteResource = async (id) => {
  try {
    await resources.deleteResource(id)
  } catch {
    // Store owns rendered error state.
  }
}

const loadResources = async () => {
  try {
    await resources.fetchResources()
  } catch {
    // Store owns rendered error state.
  }
}

onMounted(async () => {
  // load resources and ensure courses are fetched once
  await loadResources()
  if (courseStore.courses.length === 0) {
    try {
      coursesLoading.value = true
      await courseStore.fetchCourses()
    } finally {
      coursesLoading.value = false
    }
  }
})

const openModalForCreate = async () => {
  if (courseStore.courses.length === 0 && !coursesLoading.value) {
    try {
      coursesLoading.value = true
      await courseStore.fetchCourses()
    } finally {
      coursesLoading.value = false
    }
  }
  resetForm()
  modalOpen.value = true
}
</script>
