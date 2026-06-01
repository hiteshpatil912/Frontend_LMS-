<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Course work</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Assignments</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Create, review, grade, and manage assignment submissions.</p>
      </div>
      <RouterLink class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" to="/teacher/assignments/create">Create assignment</RouterLink>
    </div>
    <div v-if="store.loading" class="grid gap-4 xl:grid-cols-2"><div v-for="item in 4" :key="item" class="h-56 animate-pulse rounded-lg bg-slate-200"></div></div>
    <EmptyAssignmentState v-else-if="!store.assignments.length" />
    <div v-else class="grid gap-4 xl:grid-cols-2">
      <AssignmentCard v-for="assignment in store.assignments" :key="assignment.id" :assignment="assignment" :details-to="`/teacher/assignments/${assignment.id}`" details-label="Submissions">
        <button class="focus-ring rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50" type="button" @click="store.deleteAssignment(assignment.id)">Delete</button>
      </AssignmentCard>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import AssignmentCard from '@/components/assignment/AssignmentCard.vue'
import EmptyAssignmentState from '@/components/assignment/EmptyAssignmentState.vue'
import { useTeacherAssignmentStore } from '@/stores/teacher/assignmentStore'

const store = useTeacherAssignmentStore()
onMounted(() => store.fetchAssignments())
</script>
