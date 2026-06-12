<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Announcements</h1>
        <p class="mt-1 text-sm text-slate-500">Manage course updates, reminders, and learner notices.</p>
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
          Create Announcement
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

    <DataTable v-else-if="announcements.length" :columns="columns" :rows="announcements">
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
            @click="viewAnnouncement(row.id)"
          >
            View
          </button>
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="editAnnouncement(row.id)"
          >
            Edit
          </button>
          <button
            type="button"
            class="focus-ring inline-flex rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="deletingId === row.id"
            @click="deleteAnnouncement(row.id)"
          >
            {{ deletingId === row.id ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </template>
    </DataTable>

    <div v-else-if="!loading && !error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No announcements found.
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
            <p class="text-sm font-medium text-slate-500">Title</p>
            <p class="mt-1 font-semibold text-slate-950">{{ form.title || 'Untitled Announcement' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Body</p>
            <p class="mt-1 whitespace-pre-line text-sm text-slate-700">{{ form.body || 'No announcement body available.' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Publish Date</p>
            <p class="mt-1 text-sm text-slate-700">{{ form.published_at || 'Not published' }}</p>
          </div>
        </div>

        <form v-else class="space-y-4 p-5" @submit.prevent="saveAnnouncement">
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
            <span class="text-sm font-medium text-slate-700">Body</span>
            <textarea
              v-model.trim="form.body"
              class="focus-ring mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            ></textarea>
            <p v-if="fieldError('body')" class="mt-1 text-sm text-rose-600">{{ fieldError('body') }}</p>
          </label>

          <label class="block">
            <span class="text-sm font-medium text-slate-700">Publish Date</span>
            <input
              v-model="form.published_at"
              class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              type="datetime-local"
            />
            <p v-if="fieldError('published_at')" class="mt-1 text-sm text-rose-600">{{ fieldError('published_at') }}</p>
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
              {{ saving ? 'Saving...' : modalMode === 'edit' ? 'Update Announcement' : 'Create Announcement' }}
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
import { CalendarDaysIcon, CheckBadgeIcon, ClipboardDocumentListIcon, SpeakerWaveIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { teacherAnnouncementService } from '@/services/teacherAnnouncementService'
import { teacherCourseService } from '@/services/teacherCourseService'

const announcements = ref([])
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
  body: '',
  published_at: ''
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'audience', label: 'Audience' },
  { key: 'publishDate', label: 'Publish Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const metrics = computed(() => [
  { label: 'Total Announcements', value: announcements.value.length, trend: 'Synced from Laravel LMS', icon: SpeakerWaveIcon },
  { label: 'Published', value: countByStatus('Published'), trend: 'Visible to learners', icon: CheckBadgeIcon },
  { label: 'Drafts', value: countByStatus('Draft'), trend: 'Still being prepared', icon: ClipboardDocumentListIcon, tone: 'negative' },
  { label: 'Scheduled', value: countByStatus('Scheduled'), trend: 'Queued for later', icon: CalendarDaysIcon }
])

const selectedCourse = computed(() => courses.value.find((course) => String(course.id) === String(selectedCourseId.value)) || null)
const selectedCourseTitle = computed(() => selectedCourse.value?.title || 'Select a course')
const modalTitle = computed(() => {
  if (modalMode.value === 'view') return 'Announcement Details'
  return modalMode.value === 'edit' ? 'Edit Announcement' : 'Create Announcement'
})

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const listFrom = (payload, key) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.[key])) return payload[key]
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const formatDate = (value) => {
  if (!value) return 'Not published'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString().slice(0, 10)
}

const dateTimeInputValue = (value) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16)

  return date.toISOString().slice(0, 16)
}

const normalizeCourse = (course) => ({
  id: course.id,
  title: course.title || course.name || 'Untitled Course'
})

const normalizeStatus = (announcement) => {
  const status = String(announcement.status || '').toLowerCase()
  if (status === 'published') return 'Published'
  if (status === 'scheduled') return 'Scheduled'
  if (status === 'draft') return 'Draft'
  if (!announcement.published_at) return 'Draft'

  const publishDate = new Date(announcement.published_at)
  if (!Number.isNaN(publishDate.getTime()) && publishDate > new Date()) return 'Scheduled'

  return 'Published'
}

const normalizeAnnouncement = (announcement) => ({
  id: announcement.id,
  title: announcement.title || 'Untitled Announcement',
  body: announcement.body || '',
  audience: announcement.course_title || selectedCourseTitle.value,
  publishDate: formatDate(announcement.published_at),
  published_at: announcement.published_at || '',
  status: normalizeStatus(announcement)
})

const payloadFromForm = () => ({
  title: form.title,
  body: form.body,
  published_at: form.published_at || null
})

const countByStatus = (status) => announcements.value.filter((announcement) => announcement.status === status).length

const statusClass = (status) => {
  const classes = {
    Published: 'bg-emerald-50 text-emerald-700',
    Draft: 'bg-slate-100 text-slate-600',
    Scheduled: 'bg-brand-50 text-brand-700'
  }

  return classes[status] || 'bg-slate-100 text-slate-600'
}

const resetForm = () => {
  form.title = ''
  form.body = ''
  form.published_at = ''
  editingId.value = null
  modalError.value = ''
  validationErrors.value = {}
}

const fillForm = (announcement) => {
  form.title = announcement.title || ''
  form.body = announcement.body || ''
  form.published_at = dateTimeInputValue(announcement.published_at)
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

const loadAnnouncements = async () => {
  if (!selectedCourseId.value) {
    announcements.value = []
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await teacherAnnouncementService.getAnnouncements(selectedCourseId.value)
    announcements.value = listFrom(unwrap(response), 'announcements').map(normalizeAnnouncement)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load announcements.'
    announcements.value = []
  } finally {
    loading.value = false
  }
}

const fetchAnnouncement = async (id) => {
  const response = await teacherAnnouncementService.getAnnouncement(id)
  const payload = unwrap(response)
  return normalizeAnnouncement(payload.announcement || payload)
}

const openCreateModal = () => {
  resetForm()
  modalMode.value = 'create'
  modalOpen.value = true
}

const viewAnnouncement = async (id) => {
  resetForm()
  modalMode.value = 'view'
  modalOpen.value = true

  try {
    const announcement = await fetchAnnouncement(id)
    fillForm(announcement)
  } catch (requestError) {
    modalError.value = requestError.response?.data?.message || 'Unable to load announcement.'
  }
}

const editAnnouncement = async (id) => {
  resetForm()
  editingId.value = id
  modalMode.value = 'edit'
  modalOpen.value = true

  try {
    const announcement = await fetchAnnouncement(id)
    fillForm(announcement)
  } catch (requestError) {
    modalError.value = requestError.response?.data?.message || 'Unable to load announcement.'
  }
}

const closeModal = () => {
  modalOpen.value = false
  resetForm()
}

const saveAnnouncement = async () => {
  saving.value = true
  modalError.value = ''
  validationErrors.value = {}

  try {
    if (modalMode.value === 'edit') {
      await teacherAnnouncementService.updateAnnouncement(editingId.value, payloadFromForm())
    } else {
      await teacherAnnouncementService.createAnnouncement(selectedCourseId.value, payloadFromForm())
    }

    closeModal()
    await loadAnnouncements()
  } catch (requestError) {
    validationErrors.value = requestError.response?.data?.errors || {}
    modalError.value = requestError.response?.data?.message || 'Unable to save announcement.'
  } finally {
    saving.value = false
  }
}

const deleteAnnouncement = async (id) => {
  deletingId.value = id
  error.value = ''

  try {
    await teacherAnnouncementService.deleteAnnouncement(id)
    await loadAnnouncements()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to delete announcement.'
  } finally {
    deletingId.value = null
  }
}

watch(selectedCourseId, loadAnnouncements)

onMounted(loadCourses)
</script>
