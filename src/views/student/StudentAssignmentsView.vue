<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Course work</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">My Assignments</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Submit files, resubmit before due date, and review grades and feedback.</p>
    </div>
    <div v-if="store.loading" class="grid gap-4 xl:grid-cols-2"><div v-for="item in 4" :key="item" class="h-56 animate-pulse rounded-lg bg-slate-200"></div></div>
    <EmptyAssignmentState v-else-if="!store.assignments.length" />
    <div v-else class="grid gap-4 xl:grid-cols-2">
      <AssignmentCard v-for="assignment in store.assignments" :key="assignment.id" :assignment="assignment" :details-to="`/student/assignments/${assignment.id}`" :details-label="submissionLabel(assignment)">
        <SubmissionStatusBadge :status="store.submissionForAssignment(assignment.id)?.status || 'pending'" />
      </AssignmentCard>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import AssignmentCard from '@/components/assignment/AssignmentCard.vue'
import EmptyAssignmentState from '@/components/assignment/EmptyAssignmentState.vue'
import SubmissionStatusBadge from '@/components/assignment/SubmissionStatusBadge.vue'
import { useStudentAssignmentSubmissionStore } from '@/stores/student/assignmentSubmissionStore'

const store = useStudentAssignmentSubmissionStore()
const submissionLabel = (assignment) => (store.submissionForAssignment(assignment.id) ? 'View submission' : 'Submit')
onMounted(() => Promise.all([store.fetchAssignments(), store.fetchSubmissions()]))
</script>
