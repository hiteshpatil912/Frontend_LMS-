<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Students</h1>
      <p class="mt-1 text-sm text-slate-500">Review learner enrollment and course progress.</p>
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

    <DataTable v-else-if="students.length" :columns="columns" :rows="students">
      <template #progress="{ row }">
        <div class="flex min-w-40 items-center gap-3">
          <div class="h-2 w-24 rounded-full bg-slate-100">
            <div class="h-2 rounded-full bg-brand-600" :style="{ width: `${row.progress}%` }"></div>
          </div>
          <span class="text-sm font-medium text-slate-700">{{ row.progress }}%</span>
        </div>
      </template>
      <template #status="{ row }">
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
          {{ row.status }}
        </span>
      </template>
      <template #actions="{ row }">
        <button
          type="button"
          class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="viewStudent(row.id)"
        >
          View
        </button>
      </template>
    </DataTable>

    <div v-else-if="!error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No students found.
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div class="w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-soft">
        <div class="border-b border-slate-100 p-5">
          <h2 class="text-lg font-semibold text-slate-950">Student Details</h2>
          <p class="mt-1 text-sm text-slate-500">Enrollment and lesson completion summary.</p>
        </div>

        <div class="p-5">
          <div v-if="detailLoading" class="space-y-3">
            <div v-for="item in 4" :key="item" class="h-10 animate-pulse rounded bg-slate-100"></div>
          </div>

          <div v-else-if="detailError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {{ detailError }}
          </div>

          <div v-else class="space-y-5">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-sm font-medium text-slate-500">Name</p>
                <p class="mt-1 font-semibold text-slate-950">{{ selectedStudent.name }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-500">Email</p>
                <p class="mt-1 text-sm text-slate-700">{{ selectedStudent.email }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-500">Total Courses</p>
                <p class="mt-1 text-sm font-semibold text-slate-950">{{ selectedStudent.totalCourses }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-500">Completed Lessons Count</p>
                <p class="mt-1 text-sm font-semibold text-slate-950">{{ selectedStudent.completedLessonsCount }}</p>
              </div>
            </div>

            <div>
              <p class="text-sm font-medium text-slate-500">Enrolled Courses</p>
              <div v-if="selectedStudent.enrolledCourses.length" class="mt-2 overflow-hidden rounded-lg border border-slate-200">
                <div
                  v-for="course in selectedStudent.enrolledCourses"
                  :key="course.id || course.title"
                  class="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0"
                >
                  <span class="text-sm font-medium text-slate-700">{{ course.title }}</span>
                  <span class="text-xs text-slate-500">{{ course.status }}</span>
                </div>
              </div>
              <p v-else class="mt-2 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                No enrolled courses found.
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end border-t border-slate-100 p-5">
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
import { computed, onMounted, ref } from 'vue'
import { AcademicCapIcon, ChartBarIcon, CheckBadgeIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { teacherStudentService } from '@/services/teacherStudentService'

const students = ref([])
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const detailLoading = ref(false)
const detailError = ref('')
const selectedStudent = ref({
  name: 'Student',
  email: 'No email available',
  totalCourses: 0,
  completedLessonsCount: 0,
  enrolledCourses: []
})

const columns = [
  { key: 'name', label: 'Student' },
  { key: 'email', label: 'Email' },
  { key: 'course', label: 'Course' },
  { key: 'progress', label: 'Progress' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const averageProgress = computed(() =>
  students.value.length ? Math.round(students.value.reduce((total, student) => total + student.progress, 0) / students.value.length) : 0
)

const metrics = computed(() => [
  { label: 'Total Students', value: students.value.length, trend: 'Synced from Laravel LMS', icon: UserGroupIcon },
  { label: 'Active Learners', value: students.value.filter((student) => student.status === 'Active').length, trend: 'Currently enrolled', icon: AcademicCapIcon },
  { label: 'Completed', value: students.value.filter((student) => student.status === 'Completed').length, trend: 'Finished courses', icon: CheckBadgeIcon },
  { label: 'Average Progress', value: `${averageProgress.value}%`, trend: 'Across active courses', icon: ChartBarIcon }
])

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const listFrom = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.students)) return payload.students
  if (Array.isArray(payload.data)) return payload.data
  return []
}

const normalizeStudent = (student) => {
  const enrolledCoursesCount = Number(student.enrolled_courses_count || student.enrolledCoursesCount || 0)

  return {
    id: student.id,
    name: student.name || 'Student',
    email: student.email || 'No email available',
    course: `${enrolledCoursesCount} enrolled ${enrolledCoursesCount === 1 ? 'course' : 'courses'}`,
    progress: 0,
    status: enrolledCoursesCount > 0 ? 'Active' : 'Inactive'
  }
}

const normalizeCourse = (course) => ({
  id: course.id,
  title: course.title || course.name || 'Untitled Course',
  status: course.status || 'Enrolled'
})

const normalizeStudentDetail = (student) => {
  const enrolledCourses = Array.isArray(student.enrolled_courses)
    ? student.enrolled_courses
    : Array.isArray(student.courses)
      ? student.courses
      : []

  const totalCourses = Number(
    student.total_courses ??
      student.totalCourses ??
      student.enrolled_courses_count ??
      enrolledCourses.length
  )

  return {
    name: student.name || 'Student',
    email: student.email || 'No email available',
    totalCourses,
    completedLessonsCount: Number(student.completed_lessons_count ?? student.completedLessonsCount ?? 0),
    enrolledCourses: enrolledCourses.map(normalizeCourse)
  }
}

const loadStudents = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await teacherStudentService.getStudents()
    students.value = listFrom(unwrap(response)).map(normalizeStudent)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load students.'
    students.value = []
  } finally {
    loading.value = false
  }
}

const viewStudent = async (id) => {
  modalOpen.value = true
  detailLoading.value = true
  detailError.value = ''

  try {
    const response = await teacherStudentService.getStudent(id)
    const payload = unwrap(response)
    selectedStudent.value = normalizeStudentDetail(payload.student || payload)
  } catch (requestError) {
    detailError.value = requestError.response?.data?.message || 'Unable to load student details.'
  } finally {
    detailLoading.value = false
  }
}

const closeModal = () => {
  modalOpen.value = false
  detailError.value = ''
}

onMounted(loadStudents)
</script>
