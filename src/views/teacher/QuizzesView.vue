<template>
  <ResourcePanel title="Quizzes" description="Manage question banks, quiz publishing, and attempts." :columns="columns" :rows="store.items" />
</template>
<script setup>
import ResourcePanel from '@/components/ResourcePanel.vue'
import { useTeacherQuizStore } from '@/stores/teacher/quizStore'
const store = useTeacherQuizStore()
const columns = [{ key: 'title', label: 'Quiz' }, { key: 'questions', label: 'Questions' }, { key: 'attempts', label: 'Attempts' }, { key: 'status', label: 'Status' }]
</script>
