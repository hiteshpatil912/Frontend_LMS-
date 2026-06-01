<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <RouterLink to="/teacher/courses" class="text-sm font-medium text-brand-700">
          Back to Courses
        </RouterLink>
        <h1 class="mt-2 text-2xl font-semibold text-slate-950">Lesson Management</h1>
        <p class="mt-1 text-sm text-slate-500">Create, update, and organize lessons for this course.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="lessons.saving"
        @click="openCreateForm"
      >
        Create Lesson
      </button>
    </div>

    <div v-if="lessons.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ lessons.error.message }}
    </div>

    <form
      v-if="formOpen"
      class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      @submit.prevent="saveLesson"
    >
      <div class="grid gap-4 lg:grid-cols-2">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Title</span>
          <input
            v-model.trim="form.title"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            type="text"
          />
          <p v-if="fieldError('title')" class="mt-1 text-sm text-rose-600">{{ fieldError('title') }}</p>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Lesson Order</span>
          <input
            v-model.number="form.order"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            min="1"
            type="number"
          />
          <p v-if="fieldError('order')" class="mt-1 text-sm text-rose-600">{{ fieldError('order') }}</p>
        </label>

        <label class="block lg:col-span-2">
          <span class="text-sm font-medium text-slate-700">Description</span>
          <textarea
            v-model.trim="form.description"
            class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
          ></textarea>
          <p v-if="fieldError('description')" class="mt-1 text-sm text-rose-600">{{ fieldError('description') }}</p>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Video URL</span>
          <input
            v-model.trim="form.video_url"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            type="url"
          />
          <p v-if="fieldError('video_url')" class="mt-1 text-sm text-rose-600">{{ fieldError('video_url') }}</p>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">PDF Notes URL</span>
          <input
            v-model.trim="form.pdf_notes_url"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            type="url"
          />
          <p v-if="fieldError('pdf_notes_url')" class="mt-1 text-sm text-rose-600">{{ fieldError('pdf_notes_url') }}</p>
        </label>

        <label class="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 lg:col-span-2">
          <input
            v-model="form.is_preview"
            class="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            type="checkbox"
          />
          <span class="text-sm font-medium text-slate-700">Preview lesson</span>
        </label>
      </div>

      <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="closeForm"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="lessons.saving"
        >
          {{ lessons.saving ? 'Saving...' : editingId ? 'Update Lesson' : 'Create Lesson' }}
        </button>
      </div>
    </form>

    <div v-if="lessons.loading" class="space-y-3">
      <article v-for="item in 5" :key="item" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-3 h-4 w-full animate-pulse rounded bg-slate-100"></div>
      </article>
    </div>

    <div v-else-if="lessons.hasLessons" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Order</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Lesson</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Assets</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</th>
              <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="lesson in lessons.sortedLessons" :key="lesson.id" class="hover:bg-slate-50">
              <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">{{ lesson.order }}</td>
              <td class="px-5 py-4">
                <p class="text-sm font-semibold text-slate-950">{{ lesson.title }}</p>
                <p class="mt-1 line-clamp-2 text-sm text-slate-500">{{ lesson.description }}</p>
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                <div class="flex flex-col gap-1">
                  <a v-if="lesson.videoUrl" class="font-medium text-brand-700" :href="lesson.videoUrl" target="_blank" rel="noreferrer">Video</a>
                  <a v-if="lesson.pdfNotesUrl" class="font-medium text-brand-700" :href="lesson.pdfNotesUrl" target="_blank" rel="noreferrer">PDF Notes</a>
                  <span v-if="!lesson.videoUrl && !lesson.pdfNotesUrl" class="text-slate-400">No assets</span>
                </div>
              </td>
              <td class="whitespace-nowrap px-5 py-4">
                <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="lesson.isPreview ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                  {{ lesson.isPreview ? 'Preview' : 'Locked' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <RouterLink
                    :to="`/teacher/lessons/${lesson.id}/quizzes`"
                    class="focus-ring rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Manage Quizzes
                  </RouterLink>
                  <button
                    type="button"
                    class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    @click="openEditForm(lesson)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="focus-ring rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="lessons.deletingId === lesson.id"
                    @click="deleteLesson(lesson.id)"
                  >
                    {{ lessons.deletingId === lesson.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No lessons found for this course.
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTeacherPanelLessonStore } from '@/stores/teacher/panelLessonStore'

const route = useRoute()
const lessons = useTeacherPanelLessonStore()
const formOpen = ref(false)
const editingId = ref(null)

const form = reactive({
  title: '',
  description: '',
  video_url: '',
  pdf_notes_url: '',
  order: 1,
  is_preview: false
})

const fieldError = (field) => {
  const value = lessons.error?.validation?.[field]
  return Array.isArray(value) ? value[0] : value
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.video_url = ''
  form.pdf_notes_url = ''
  form.order = lessons.lessons.length + 1
  form.is_preview = false
  editingId.value = null
}

const openCreateForm = () => {
  resetForm()
  formOpen.value = true
}

const openEditForm = (lesson) => {
  editingId.value = lesson.id
  form.title = lesson.title
  form.description = lesson.description
  form.video_url = lesson.videoUrl
  form.pdf_notes_url = lesson.pdfNotesUrl
  form.order = lesson.order
  form.is_preview = lesson.isPreview
  formOpen.value = true
}

const closeForm = () => {
  formOpen.value = false
  resetForm()
}

const saveLesson = async () => {
  try {
    if (editingId.value) {
      await lessons.updateLesson(editingId.value, { ...form })
    } else {
      await lessons.createLesson(route.params.id, { ...form })
    }

    closeForm()
  } catch {
    // Store owns the rendered error state.
  }
}

const deleteLesson = async (lessonId) => {
  try {
    await lessons.deleteLesson(lessonId)
  } catch {
    // Store owns the rendered error state.
  }
}

const loadLessons = async () => {
  try {
    await lessons.fetchLessons(route.params.id)
    form.order = lessons.lessons.length + 1
  } catch {
    // Store owns the rendered error state.
  }
}

onMounted(loadLessons)
</script>
