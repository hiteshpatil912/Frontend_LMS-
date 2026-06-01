<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Submissions</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ store.currentAssignment?.title || 'Assignment submissions' }}</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Review uploaded files, assign grades, and add feedback comments.</p>
      </div>
      <RouterLink class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to="/teacher/assignments">Back</RouterLink>
    </div>

    <SubmissionTable :submissions="submissions" :loading="store.loading" @grade="openGrade" />

    <TransitionRoot appear :show="dialogOpen" as="template">
      <Dialog as="div" class="relative z-50" @close="dialogOpen = false">
        <div class="fixed inset-0 bg-slate-950/40" />
        <div class="fixed inset-0 grid place-items-center p-4">
          <DialogPanel class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <DialogTitle class="text-lg font-semibold text-slate-950">Grade submission</DialogTitle>
            <div class="mt-5 space-y-4">
              <GradeInput v-model="gradeForm.grade" :total="selectedSubmission?.totalMarks || 100" />
              <FeedbackEditor v-model="gradeForm.feedback" />
              <button class="focus-ring w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" type="button" @click="saveGrade">Save grade</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </TransitionRoot>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue'
import FeedbackEditor from '@/components/assignment/FeedbackEditor.vue'
import GradeInput from '@/components/assignment/GradeInput.vue'
import SubmissionTable from '@/components/assignment/SubmissionTable.vue'
import { useTeacherAssignmentStore } from '@/stores/teacher/assignmentStore'

const route = useRoute()
const store = useTeacherAssignmentStore()
const dialogOpen = ref(false)
const selectedSubmission = ref(null)
const gradeForm = reactive({ grade: 0, feedback: '' })
const submissions = computed(() => store.submissionsForAssignment(route.params.id))

const openGrade = (submission) => {
  selectedSubmission.value = submission
  gradeForm.grade = submission.grade || 0
  gradeForm.feedback = submission.feedback || ''
  dialogOpen.value = true
}
const saveGrade = async () => {
  await store.gradeSubmission(selectedSubmission.value.id, { grade: gradeForm.grade, feedback: gradeForm.feedback, totalMarks: selectedSubmission.value.totalMarks })
  dialogOpen.value = false
}

onMounted(async () => {
  await Promise.all([store.fetchSingleAssignment(route.params.id), store.fetchSubmissions(route.params.id)])
})
</script>
