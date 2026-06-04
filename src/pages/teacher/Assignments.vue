<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Assignments</h1>
        <p class="mt-1 text-sm text-slate-500">Track assignment activity, submissions, and review status.</p>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row">
        <select
          v-model="selectedCourseId"
          class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          :disabled="loadingCourses || saving"
        >
          <option value="">Select course</option>
          <option v-for="course in courses" :key="course.id" :value="String(course.id)">
            {{ course.title }}
          </option>
        </select>
        <button
          type="button"
          class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!selectedCourseId || saving"
          @click="openCreateModal"
        >
          Create Assignment
        </button>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in metrics" :key="metric.label" v-bind="metric" />
    </div>

    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="space-y-3 p-5">
        <div v-for="item in 5" :key="item" class="h-10 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>

    <DataTable v-else-if="assignments.length" :columns="columns" :rows="assignments">
      <template #submissions="{ row }">
        <span class="font-medium text-slate-700">{{ row.submissions }}</span>
      </template>
      <template #status="{ row }">
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass(row.status)">
          {{ row.status }}
        </span>
      </template>
      <template #actions="{ row }">
        <div class="flex gap-2">
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="viewAssignment(row.id)"
          >
            View
          </button>
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="editAssignment(row.id)"
          >
            Edit
          </button>
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="deletingId === row.id"
            @click="deleteAssignment(row.id)"
          >
            {{ deletingId === row.id ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </template>
    </DataTable>

    <div v-else-if="!loading && !error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No assignments found.
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div class="w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-soft">
        <div class="border-b border-slate-100 p-5">
          <h2 class="text-lg font-semibold text-slate-950">{{ modalTitle }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ selectedCourseTitle }}</p>
        </div>

        <div v-if="modalMode === 'view'" class="space-y-4 p-5">
          <div>
            <p class="text-sm font-medium text-slate-500">Title</p>
            <p class="mt-1 font-semibold text-slate-950">{{ form.title || 'Untitled Assignment' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Description</p>
            <p class="mt-1 whitespace-pre-line text-sm text-slate-700">{{ form.description || 'No description available.' }}</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm font-medium text-slate-500">Due Date</p>
              <p class="mt-1 text-sm text-slate-700">{{ form.due_date || 'Not set' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Status</p>
              <p class="mt-1 text-sm text-slate-700">{{ form.status || 'Draft' }}</p>
            </div>
          </div>
        </div>

        <form v-else class="space-y-4 p-5" @submit.prevent="saveAssignment">
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

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="text-sm font-medium text-slate-700">Due Date</span>
              <input
                v-model="form.due_date"
                class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                type="date"
              />
              <p v-if="fieldError('due_date')" class="mt-1 text-sm text-rose-600">{{ fieldError('due_date') }}</p>
            </label>

            <label class="block">
              <span class="text-sm font-medium text-slate-700">Status</span>
              <select v-model="form.status" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <p v-if="fieldError('status')" class="mt-1 text-sm text-rose-600">{{ fieldError('status') }}</p>
            </label>
          </div>

          <div v-if="modalError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {{ modalError }}
          </div>

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
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : modalMode === 'edit' ? 'Update Assignment' : 'Create Assignment' }}
            </button>
          </div>
        </form>

        <div v-if="modalMode === 'view'" class="flex justify-end border-t border-slate-100 p-5">
          <button
            type="button"
            class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { CheckBadgeIcon, ClipboardDocumentListIcon, ClockIcon, InboxStackIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { teacherAssignmentService } from '@/services/teacherAssignmentService'
import { teacherCourseService } from '@/services/teacherCourseService'

const assignments = ref([])
const courses = ref([])
const selectedCourseId = ref('')
const loading = ref(false)
const loadingCourses = ref(false)
const saving = ref(false)
const deletingId = ref(null)
const error = ref('')
const modalError = ref('')
const validationErrors = ref({})
const modalOpen = ref(false)
const modalMode = ref('create')
const editingId = ref(null)

const form = reactive({
  title: '',
  description: '',
  due_date: '',
  status: 'draft'
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'course', label: 'Course' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'submissions', label: 'Submissions' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const metrics = computed(() => [
  { label: 'Total Assignments', value: assignments.value.length, trend: 'Synced from Laravel LMS', icon: ClipboardDocumentListIcon },
  { label: 'Pending Review', value: countByStatus('Pending Review'), trend: 'Needs teacher review', icon: ClockIcon, tone: 'negative' },
  { label: 'Submitted', value: countByStatus('Submitted'), trend: 'Awaiting completion', icon: InboxStackIcon },
  { label: 'Completed', value: countByStatus('Completed'), trend: 'Finished assignments', icon: CheckBadgeIcon }
])

const selectedCourse = computed(() => courses.value.find((course) => String(course.id) === String(selectedCourseId.value)) || null)
const selectedCourseTitle = computed(() => selectedCourse.value?.title || 'Select a course')
const modalTitle = computed(() => {
  if (modalMode.value === 'view') return 'Assignment Details'
  return modalMode.value === 'edit' ? 'Edit Assignment' : 'Create Assignment'
})

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const listFrom = (payload, key) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.[key])) return payload[key]
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const dateFrom = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toISOString().slice(0, 10)
}

const normalizeCourse = (course) => ({
  id: course.id,
  title: course.title || course.name || 'Untitled Course'
})

const normalizeStatus = (status) => {
  const value = String(status || '').toLowerCase()
  if (value === 'completed') return 'Completed'
  if (value === 'submitted') return 'Submitted'
  if (value === 'pending_review' || value === 'pending review') return 'Pending Review'
  if (value === 'published') return 'Submitted'
  return 'Pending Review'
}

const normalizeAssignment = (assignment) => ({
  id: assignment.id,
  title: assignment.title || 'Untitled Assignment',
  description: assignment.description || '',
  course: assignment.course_title || selectedCourseTitle.value,
  dueDate: dateFrom(assignment.due_date || assignment.dueDate),
  submissions: `${Number(assignment.submissions_count || assignment.submissions || 0)} / ${Number(assignment.students_count || assignment.total_students || 0)}`,
  status: normalizeStatus(assignment.status),
  rawStatus: assignment.status || 'draft'
})

const payloadFromForm = () => ({
  title: form.title,
  description: form.description,
  due_date: form.due_date,
  status: form.status
})

const countByStatus = (status) => assignments.value.filter((assignment) => assignment.status === status).length

const statusClass = (status) => {
  const classes = {
    'Pending Review': 'bg-amber-50 text-amber-700',
    Submitted: 'bg-brand-50 text-brand-700',
    Completed: 'bg-emerald-50 text-emerald-700'
  }

  return classes[status] || 'bg-slate-100 text-slate-600'
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.due_date = ''
  form.status = 'draft'
  editingId.value = null
  modalError.value = ''
  validationErrors.value = {}
}

const fillForm = (assignment) => {
  form.title = assignment.title || ''
  form.description = assignment.description || ''
  form.due_date = dateFrom(assignment.due_date || assignment.dueDate)
  form.status = String(assignment.status || assignment.rawStatus || 'draft').toLowerCase().replace('pending review', 'draft')
}

const fieldError = (field) => {
  const value = validationErrors.value?.[field]
  return Array.isArray(value) ? value[0] : value
}

const loadCourses = async () => {
  loadingCourses.value = true
  error.value = ''

  try {
    const response = await teacherCourseService.getCourses()
    courses.value = listFrom(unwrap(response), 'courses').map(normalizeCourse)

    if (!selectedCourseId.value && courses.value.length) {
      selectedCourseId.value = String(courses.value[0].id)
    }
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load teacher courses.'
    courses.value = []
  } finally {
    loadingCourses.value = false
  }
}

const loadAssignments = async () => {
  if (!selectedCourseId.value) {
    assignments.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await teacherAssignmentService.getAssignments(selectedCourseId.value)
    assignments.value = listFrom(unwrap(response), 'assignments').map(normalizeAssignment)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load assignments.'
    assignments.value = []
  } finally {
    loading.value = false
  }
}

const fetchAssignment = async (id) => {
  const response = await teacherAssignmentService.getAssignment(id)
  return normalizeAssignment(unwrap(response).assignment || unwrap(response))
}

const openCreateModal = () => {
  resetForm()
  modalMode.value = 'create'
  modalOpen.value = true
}

const viewAssignment = async (id) => {
  resetForm()
  modalMode.value = 'view'
  modalOpen.value = true

  try {
    const assignment = await fetchAssignment(id)
    fillForm(assignment)
  } catch (requestError) {
    modalError.value = requestError.response?.data?.message || 'Unable to load assignment.'
  }
}

const editAssignment = async (id) => {
  resetForm()
  editingId.value = id
  modalMode.value = 'edit'
  modalOpen.value = true

  try {
    const assignment = await fetchAssignment(id)
    fillForm(assignment)
  } catch (requestError) {
    modalError.value = requestError.response?.data?.message || 'Unable to load assignment.'
  }
}

const closeModal = () => {
  modalOpen.value = false
  resetForm()
}

const saveAssignment = async () => {
  saving.value = true
  modalError.value = ''
  validationErrors.value = {}

  try {
    if (modalMode.value === 'edit') {
      await teacherAssignmentService.updateAssignment(editingId.value, payloadFromForm())
    } else {
      await teacherAssignmentService.createAssignment(selectedCourseId.value, payloadFromForm())
    }

    closeModal()
    await loadAssignments()
  } catch (requestError) {
    validationErrors.value = requestError.response?.data?.errors || {}
    modalError.value = requestError.response?.data?.message || 'Unable to save assignment.'
  } finally {
    saving.value = false
  }
}

const deleteAssignment = async (id) => {
  deletingId.value = id
  error.value = ''

  try {
    await teacherAssignmentService.deleteAssignment(id)
    await loadAssignments()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to delete assignment.'
  } finally {
    deletingId.value = null
  }
}

watch(selectedCourseId, loadAssignments)

onMounted(loadCourses)
</script>
