<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div v-if="loading" class="space-y-3 p-5">
      <div v-for="item in 4" :key="item" class="h-16 animate-pulse rounded-lg bg-slate-100"></div>
    </div>
    <EmptyAssignmentState v-else-if="!submissions.length" title="No submissions" message="Student submissions will appear here for grading." />
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-5 py-3">Student</th>
            <th class="px-5 py-3">File</th>
            <th class="px-5 py-3">Status</th>
            <th class="px-5 py-3">Grade</th>
            <th class="px-5 py-3">Feedback</th>
            <th class="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="submission in submissions" :key="submission.id">
            <td class="px-5 py-4 font-medium text-slate-950">{{ submission.studentName }}</td>
            <td class="px-5 py-4 text-slate-600">{{ submission.fileName }}</td>
            <td class="px-5 py-4"><SubmissionStatusBadge :status="submission.status" /></td>
            <td class="px-5 py-4">{{ submission.grade ?? '-' }} / {{ submission.totalMarks }}</td>
            <td class="px-5 py-4 text-slate-600">{{ submission.feedback || '-' }}</td>
            <td class="px-5 py-4 text-right">
              <button class="focus-ring rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700" type="button" @click="$emit('grade', submission)">Grade</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import EmptyAssignmentState from '@/components/assignment/EmptyAssignmentState.vue'
import SubmissionStatusBadge from '@/components/assignment/SubmissionStatusBadge.vue'

defineProps({ submissions: { type: Array, default: () => [] }, loading: { type: Boolean, default: false } })
defineEmits(['grade'])
</script>
