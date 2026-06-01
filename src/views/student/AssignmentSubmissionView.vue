<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Assignment submission</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ assignment?.title || 'Assignment' }}</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">{{ assignment?.description }}</p>
      </div>
      <RouterLink class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to="/student/assignments">Back</RouterLink>
    </div>

    <div v-if="store.loading" class="h-80 animate-pulse rounded-lg bg-slate-200"></div>
    <div v-else-if="assignment" class="grid gap-6 xl:grid-cols-[1fr_360px]">
      <form class="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="submit">
        <div>
          <span class="text-sm font-medium text-slate-700">Submission file</span>
          <div class="mt-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p class="text-sm font-medium text-slate-700">{{ form.fileName || 'PDF, DOC, DOCX, ZIP, or image files' }}</p>
            <input class="mt-3 text-sm" type="file" accept=".pdf,.doc,.docx,.zip,image/*" @change="selectFile" />
          </div>
        </div>
        <button class="focus-ring w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="store.submitting || !form.fileName">
          {{ store.submitting ? 'Submitting...' : existing ? 'Resubmit assignment' : 'Submit assignment' }}
        </button>
      </form>
      <aside class="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <DueDateBadge :date="assignment.dueDate" />
        <div>
          <p class="text-sm text-slate-500">Total marks</p>
          <p class="mt-1 text-xl font-semibold text-slate-950">{{ assignment.totalMarks }}</p>
        </div>
        <div v-if="existing" class="space-y-3">
          <SubmissionStatusBadge :status="existing.status" />
          <p class="text-sm text-slate-600">File: {{ existing.fileName }}</p>
          <p class="text-sm text-slate-600">Grade: {{ existing.grade ?? '-' }} / {{ existing.totalMarks }}</p>
          <p class="text-sm text-slate-600">Percentage: {{ existing.grade ? Math.round((existing.grade / existing.totalMarks) * 100) : 0 }}%</p>
          <p class="text-sm text-slate-600">Feedback: {{ existing.feedback || 'No feedback yet.' }}</p>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import DueDateBadge from '@/components/assignment/DueDateBadge.vue'
import SubmissionStatusBadge from '@/components/assignment/SubmissionStatusBadge.vue'
import { useStudentAssignmentSubmissionStore } from '@/stores/student/assignmentSubmissionStore'

const route = useRoute()
const store = useStudentAssignmentSubmissionStore()
const form = reactive({ fileName: '' })
const assignment = computed(() => store.currentAssignment)
const existing = computed(() => store.submissionForAssignment(route.params.id))

const selectFile = (event) => {
  form.fileName = event.target.files?.[0]?.name || ''
}
const submit = () => store.submitAssignment(route.params.id, { fileName: form.fileName })

onMounted(async () => {
  await Promise.all([store.fetchAssignments(), store.fetchSubmissions()])
  await store.fetchSingleAssignment(route.params.id)
})
</script>
