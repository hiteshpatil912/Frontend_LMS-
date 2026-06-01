<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Course work</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Create Assignment</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Attach assignment files, set due dates, and define grading marks.</p>
    </div>
    <AssignmentForm :courses="courseStore.courses" :lessons="lessonStore.lessons" :saving="assignmentStore.saving" @submit="createAssignment" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AssignmentForm from '@/components/assignment/AssignmentForm.vue'
import { useTeacherAssignmentStore } from '@/stores/teacher/assignmentStore'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'
import { useTeacherLessonStore } from '@/stores/teacher/lessonStore'

const router = useRouter()
const assignmentStore = useTeacherAssignmentStore()
const courseStore = useTeacherCourseStore()
const lessonStore = useTeacherLessonStore()

const createAssignment = async (payload) => {
  await assignmentStore.createAssignment(payload)
  router.push('/teacher/assignments')
}

onMounted(() => courseStore.fetchCourses())
</script>
