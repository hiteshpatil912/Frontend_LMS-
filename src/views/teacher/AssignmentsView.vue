<template>
  <ResourcePanel title="Assignments" description="Create, review, and grade practical course work." :columns="columns" :rows="store.items" />
</template>
<script setup>
import ResourcePanel from '@/components/ResourcePanel.vue'
import { useTeacherAssignmentStore } from '@/stores/teacher/assignmentStore'
const store = useTeacherAssignmentStore()
const columns = [{ key: 'title', label: 'Assignment' }, { key: 'course', label: 'Course' }, { key: 'submissions', label: 'Submissions' }, { key: 'status', label: 'Status' }]
</script>
