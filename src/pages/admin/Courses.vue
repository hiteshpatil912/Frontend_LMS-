<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Admin workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Courses</h1>
        <p class="mt-1 text-sm text-slate-500">Review, approve, reject, and remove platform courses.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="courses.loading"
        @click="loadCourses"
      >
        Refresh
      </button>
    </div>

    <div v-if="courses.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ courses.error.message }}
    </div>

    <div v-if="courses.loading" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div v-for="item in 6" :key="item" class="grid gap-4 border-b border-slate-100 p-5 md:grid-cols-4">
        <div class="h-4 animate-pulse rounded bg-slate-200"></div>
        <div class="h-4 animate-pulse rounded bg-slate-100"></div>
        <div class="h-4 animate-pulse rounded bg-slate-200"></div>
        <div class="h-4 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>

    <div v-else-if="courses.hasCourses" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Title</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Instructor</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="course in courses.courses" :key="course.id" class="hover:bg-slate-50">
              <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-900">{{ course.title }}</td>
              <td class="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{{ course.instructor }}</td>
              <td class="whitespace-nowrap px-5 py-4">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
                  :class="statusClass(course.status)"
                >
                  {{ course.status }}
                </span>
              </td>
              <td class="whitespace-nowrap px-5 py-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="focus-ring rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="courses.savingId === course.id"
                    @click="approveCourse(course.id)"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    class="focus-ring rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="courses.savingId === course.id"
                    @click="rejectCourse(course.id)"
                  >
                    Reject
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No courses found.
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminPanelCourseStore } from '@/stores/admin/adminCourseStore'

const courses = useAdminPanelCourseStore()

const loadCourses = async () => {
  try {
    await courses.fetchCourses()
  } catch {
    // Store owns the rendered error state.
  }
}

const approveCourse = async (id) => {
  try {
    await courses.approveCourse(id)
  } catch {
    // Store owns the rendered error state.
  }
}

const rejectCourse = async (id) => {
  try {
    await courses.rejectCourse(id)
  } catch {
    // Store owns the rendered error state.
  }
}

const deleteCourse = async (id) => {
  try {
    await courses.deleteCourse(id)
  } catch {
    // Store owns the rendered error state.
  }
}

const statusClass = (status) => {
  const normalized = String(status || '').toLowerCase()

  if (normalized === 'approved' || normalized === 'published') {
    return 'bg-emerald-50 text-emerald-700'
  }

  if (normalized === 'rejected') {
    return 'bg-red-50 text-red-700'
  }

  return 'bg-amber-50 text-amber-700'
}

onMounted(loadCourses)
</script>
