<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">My Courses</h1>
        <p class="mt-1 text-sm text-slate-500">Create, update, and manage your course catalog.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="courses.saving"
        @click="openCreateForm"
      >
        Create Course
      </button>
    </div>

    <div v-if="courses.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ courses.error.message }}
    </div>

    <form
      v-if="formOpen"
      class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      @submit.prevent="saveCourse"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Course Title</span>
          <input
            v-model.trim="form.title"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            :class="{ 'border-red-300': fieldError('title') }"
            type="text"
            required
          />
          <span v-if="fieldError('title')" class="mt-1 block text-sm text-red-600">
            {{ fieldError('title') }}
          </span>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Status</span>
          <select v-model="form.status" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label class="mt-4 block">
        <span class="text-sm font-medium text-slate-700">Description</span>
        <textarea
          v-model.trim="form.description"
          class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
          :class="{ 'border-red-300': fieldError('description') }"
          required
        ></textarea>
        <span v-if="fieldError('description')" class="mt-1 block text-sm text-red-600">
          {{ fieldError('description') }}
        </span>
      </label>

      <label class="mt-4 block">
        <span class="text-sm font-medium text-slate-700">Price</span>
        <input
          v-model.number="form.price"
          class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          :class="{ 'border-red-300': fieldError('price') }"
          type="number"
          min="0"
          step="0.01"
          required
        />
        <span v-if="fieldError('price')" class="mt-1 block text-sm text-red-600">
          {{ fieldError('price') }}
        </span>
      </label>

      <label class="mt-4 block">
        <span class="text-sm font-medium text-slate-700">Thumbnail URL</span>
        <input
          v-model.trim="form.thumbnail"
          class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          :class="{ 'border-red-300': fieldError('thumbnail') }"
          type="url"
        />
        <span v-if="fieldError('thumbnail')" class="mt-1 block text-sm text-red-600">
          {{ fieldError('thumbnail') }}
        </span>
      </label>

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
          :disabled="courses.saving"
        >
          {{ courses.saving ? 'Saving...' : editingId ? 'Update Course' : 'Create Course' }}
        </button>
      </div>
    </form>

    <div v-if="courses.loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in 6" :key="item" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="h-40 animate-pulse bg-slate-200"></div>
        <div class="space-y-3 p-5">
          <div class="h-5 w-3/4 animate-pulse rounded bg-slate-200"></div>
          <div class="h-4 w-1/2 animate-pulse rounded bg-slate-100"></div>
          <div class="h-9 w-full animate-pulse rounded bg-slate-200"></div>
        </div>
      </article>
    </div>

    <div v-else-if="courses.hasCourses" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="course in courses.courses"
        :key="course.id"
        class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        <div class="h-40 bg-slate-200">
          <img
            v-if="course.thumbnail"
            :src="course.thumbnail"
            :alt="course.title"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-brand-600 to-slate-900 text-sm font-semibold text-white">
            {{ initials(course.title) }}
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-slate-950">{{ course.title }}</h2>
              <p class="mt-1 text-sm text-slate-500">
                {{ course.lessonsCount }} lessons · {{ course.studentsCount }} students
              </p>
            </div>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
              {{ course.status }}
            </span>
          </div>

          <div class="mt-5 grid gap-2 sm:grid-cols-3">
            <RouterLink
              :to="`/teacher/courses/${course.id}/lessons`"
              class="focus-ring rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
            >
              Manage Lessons
            </RouterLink>
            <button
              type="button"
              class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="openEditForm(course)"
            >
              Edit
            </button>
            <button
              type="button"
              class="focus-ring rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="courses.deletingId === course.id"
              @click="deleteCourse(course.id)"
            >
              {{ courses.deletingId === course.id ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No teacher courses found.
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useTeacherPanelCourseStore } from '@/stores/teacher/panelCourseStore'

const courses = useTeacherPanelCourseStore()
const formOpen = ref(false)
const editingId = ref(null)

const form = reactive({
  title: '',
  description: '',
  price: 0,
  status: 'draft',
  thumbnail: ''
})

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.price = 0
  form.status = 'draft'
  form.thumbnail = ''
  editingId.value = null
}

const openCreateForm = () => {
  resetForm()
  formOpen.value = true
}

const openEditForm = (course) => {
  editingId.value = course.id
  form.title = course.title
  form.description = course.description || ''
  form.price = Number(course.price || 0)
  form.status = course.status
  form.thumbnail = course.thumbnail || ''
  formOpen.value = true
}

const closeForm = () => {
  formOpen.value = false
  resetForm()
}

const saveCourse = async () => {
  const payload = {
    title: form.title,
    description: form.description,
    price: form.price,
    thumbnail: form.thumbnail,
    status: form.status
  }

  try {
    if (editingId.value) {
      await courses.updateCourse(editingId.value, payload)
    } else {
      await courses.createCourse(payload)
    }

    closeForm()
  } catch {
    // Store owns the rendered error state.
  }
}

const deleteCourse = async (courseId) => {
  try {
    await courses.deleteCourse(courseId)
  } catch {
    // Store owns the rendered error state.
  }
}

const loadCourses = async () => {
  try {
    await courses.fetchCourses()
  } catch {
    // Store owns the rendered error state.
  }
}

const fieldError = (field) => {
  const value = courses.error?.validation?.[field]
  return Array.isArray(value) ? value[0] : value
}

const initials = (title) =>
  String(title || 'Course')
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

onMounted(loadCourses)
</script>
