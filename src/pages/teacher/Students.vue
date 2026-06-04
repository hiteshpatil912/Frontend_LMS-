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
    </DataTable>

    <div v-else-if="!error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No students found.
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

const columns = [
  { key: 'name', label: 'Student' },
  { key: 'email', label: 'Email' },
  { key: 'course', label: 'Course' },
  { key: 'progress', label: 'Progress' },
  { key: 'status', label: 'Status' }
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

onMounted(loadStudents)
</script>
