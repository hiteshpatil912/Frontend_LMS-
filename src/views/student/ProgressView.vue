<template>
  <ResourcePanel title="Progress" description="Course completion, assessment scores, and learning status." :columns="columns" :rows="store.items" />
</template>
<script setup>
import ResourcePanel from '@/components/ResourcePanel.vue'
import { useStudentProgressStore } from '@/stores/student/progressStore'
const store = useStudentProgressStore()
const columns = [{ key: 'course', label: 'Course' }, { key: 'completed', label: 'Completed' }, { key: 'score', label: 'Score' }, { key: 'status', label: 'Status' }]
</script>
