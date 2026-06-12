<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Discussions</h1>
        <p class="mt-1 text-sm text-slate-500">Monitor course conversations and learner questions.</p>
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
          New Discussion
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

    <DataTable v-else-if="discussions.length" :columns="columns" :rows="discussions">
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
      <template #actions="{ row }">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="viewDiscussion(row.id)"
          >
            View
          </button>
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="editDiscussion(row.id)"
          >
            Edit
          </button>
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="deletingId === row.id"
            @click="deleteDiscussion(row.id)"
          >
            {{ deletingId === row.id ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </template>
    </DataTable>

    <div v-else-if="!loading && !error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No discussions found.
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div class="w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-soft">
        <div class="border-b border-slate-100 p-5">
          <h2 class="text-lg font-semibold text-slate-950">{{ modalTitle }}</h2>
          <p class="mt-1 text-sm text-slate-500">{{ selectedCourseTitle }}</p>
        </div>

        <div v-if="modalMode === 'view'" class="space-y-4 p-5">
          <div v-if="modalError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {{ modalError }}
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Message</p>
            <p class="mt-1 whitespace-pre-line text-sm text-slate-700">{{ form.message || 'No discussion message available.' }}</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm font-medium text-slate-500">Last Activity</p>
              <p class="mt-1 text-sm text-slate-700">{{ form.lastActivity || 'Not available' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500">Status</p>
              <p class="mt-1 text-sm text-slate-700">{{ form.status || 'Active' }}</p>
            </div>
          </div>
        </div>

        <form v-else class="space-y-4 p-5" @submit.prevent="saveDiscussion">
          <label class="block">
            <span class="text-sm font-medium text-slate-700">Message</span>
            <textarea
              v-model.trim="form.message"
              class="focus-ring mt-1 min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            ></textarea>
            <p v-if="fieldError('message')" class="mt-1 text-sm text-rose-600">{{ fieldError('message') }}</p>
          </label>

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
              {{ saving ? 'Saving...' : modalMode === 'edit' ? 'Update Discussion' : 'Create Discussion' }}
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
import { ChatBubbleLeftRightIcon, CheckBadgeIcon, ClockIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { teacherCourseService } from '@/services/teacherCourseService'
import { teacherDiscussionService } from '@/services/teacherDiscussionService'

const discussions = ref([])
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
  message: '',
  lastActivity: '',
  status: ''
})

const columns = [
  { key: 'topic', label: 'Topic' },
  { key: 'course', label: 'Course' },
  { key: 'replies', label: 'Replies' },
  { key: 'lastActivity', label: 'Last Activity' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const metrics = computed(() => [
  { label: 'Total Discussions', value: discussions.value.length, trend: 'Synced from Laravel LMS', icon: ChatBubbleLeftRightIcon },
  { label: 'Active Discussions', value: countByStatus('Active'), trend: 'Open conversations', icon: ClockIcon },
  { label: 'Resolved Discussions', value: countByStatus('Resolved'), trend: 'Answered topics', icon: CheckBadgeIcon },
  { label: 'New This Week', value: discussions.value.filter((discussion) => discussion.isNewThisWeek).length, trend: 'Recently started', icon: SparklesIcon }
])

const selectedCourse = computed(() => courses.value.find((course) => String(course.id) === String(selectedCourseId.value)) || null)
const selectedCourseTitle = computed(() => selectedCourse.value?.title || 'Select a course')
const modalTitle = computed(() => {
  if (modalMode.value === 'view') return 'Discussion Details'
  return modalMode.value === 'edit' ? 'Edit Discussion' : 'Create Discussion'
})

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const listFrom = (payload, key) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.[key])) return payload[key]
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const formatDate = (value) => {
  if (!value) return 'Not available'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString().slice(0, 10)
}

const normalizeCourse = (course) => ({
  id: course.id,
  title: course.title || course.name || 'Untitled Course'
})

const normalizeStatus = (discussion) => {
  const status = String(discussion.status || '').toLowerCase()
  if (status === 'resolved' || discussion.resolved_at) return 'Resolved'
  return 'Active'
}

const isNewThisWeek = (value) => {
  if (!value) return false

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return date >= oneWeekAgo
}

const normalizeDiscussion = (discussion) => {
  const activityDate = discussion.last_activity_at || discussion.updated_at || discussion.created_at

  return {
    id: discussion.id,
    message: discussion.message || discussion.topic || '',
    topic: discussion.message || discussion.topic || 'Untitled Discussion',
    course: discussion.course_title || selectedCourseTitle.value,
    replies: Number(discussion.replies_count || discussion.replies || 0),
    lastActivity: formatDate(activityDate),
    status: normalizeStatus(discussion),
    isNewThisWeek: isNewThisWeek(discussion.created_at)
  }
}

const payloadFromForm = () => ({
  message: form.message
})

const countByStatus = (status) => discussions.value.filter((discussion) => discussion.status === status).length

const statusClass = (status) => {
  const classes = {
    Active: 'bg-brand-50 text-brand-700',
    Resolved: 'bg-emerald-50 text-emerald-700'
  }

  return classes[status] || 'bg-slate-100 text-slate-600'
}

const resetForm = () => {
  form.message = ''
  form.lastActivity = ''
  form.status = ''
  editingId.value = null
  modalError.value = ''
  validationErrors.value = {}
}

const fillForm = (discussion) => {
  form.message = discussion.message || discussion.topic || ''
  form.lastActivity = discussion.lastActivity || formatDate(discussion.last_activity_at || discussion.updated_at || discussion.created_at)
  form.status = discussion.status || normalizeStatus(discussion)
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

const loadDiscussions = async () => {
  if (!selectedCourseId.value) {
    discussions.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await teacherDiscussionService.getDiscussions(selectedCourseId.value)
    discussions.value = listFrom(unwrap(response), 'discussions').map(normalizeDiscussion)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load discussions.'
    discussions.value = []
  } finally {
    loading.value = false
  }
}

const fetchDiscussion = async (id) => {
  const response = await teacherDiscussionService.getDiscussion(id)
  const payload = unwrap(response)
  return normalizeDiscussion(payload.discussion || payload)
}

const openCreateModal = () => {
  resetForm()
  modalMode.value = 'create'
  modalOpen.value = true
}

const viewDiscussion = async (id) => {
  resetForm()
  modalMode.value = 'view'
  modalOpen.value = true

  try {
    const discussion = await fetchDiscussion(id)
    fillForm(discussion)
  } catch (requestError) {
    modalError.value = requestError.response?.data?.message || 'Unable to load discussion.'
  }
}

const editDiscussion = async (id) => {
  resetForm()
  editingId.value = id
  modalMode.value = 'edit'
  modalOpen.value = true

  try {
    const discussion = await fetchDiscussion(id)
    fillForm(discussion)
  } catch (requestError) {
    modalError.value = requestError.response?.data?.message || 'Unable to load discussion.'
  }
}

const closeModal = () => {
  modalOpen.value = false
  resetForm()
}

const saveDiscussion = async () => {
  saving.value = true
  modalError.value = ''
  validationErrors.value = {}

  try {
    if (modalMode.value === 'edit') {
      await teacherDiscussionService.updateDiscussion(editingId.value, payloadFromForm())
    } else {
      await teacherDiscussionService.createDiscussion(selectedCourseId.value, payloadFromForm())
    }

    closeModal()
    await loadDiscussions()
  } catch (requestError) {
    validationErrors.value = requestError.response?.data?.errors || {}
    modalError.value = requestError.response?.data?.message || 'Unable to save discussion.'
  } finally {
    saving.value = false
  }
}

const deleteDiscussion = async (id) => {
  deletingId.value = id
  error.value = ''

  try {
    await teacherDiscussionService.deleteDiscussion(id)
    await loadDiscussions()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to delete discussion.'
  } finally {
    deletingId.value = null
  }
}

watch(selectedCourseId, loadDiscussions)

onMounted(loadCourses)
</script>
