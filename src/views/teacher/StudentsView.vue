<template>
  <ResourcePanel title="Students" description="Track student progress, risk, and coaching needs." :columns="columns" :rows="store.items" />
</template>
<script setup>
import ResourcePanel from '@/components/ResourcePanel.vue'
import { useTeacherStudentStore } from '@/stores/teacher/studentStore'
const store = useTeacherStudentStore()
const columns = [{ key: 'name', label: 'Student' }, { key: 'course', label: 'Course' }, { key: 'progress', label: 'Progress' }, { key: 'status', label: 'Status' }]
</script>
