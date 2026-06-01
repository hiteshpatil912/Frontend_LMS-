<template>
  <ResourcePanel title="Lessons" description="Resume current modules and plan upcoming lessons." :columns="columns" :rows="store.items" />
</template>
<script setup>
import ResourcePanel from '@/components/ResourcePanel.vue'
import { useStudentLessonStore } from '@/stores/student/lessonStore'
const store = useStudentLessonStore()
const columns = [{ key: 'title', label: 'Lesson' }, { key: 'course', label: 'Course' }, { key: 'duration', label: 'Duration' }, { key: 'status', label: 'Status' }]
</script>
