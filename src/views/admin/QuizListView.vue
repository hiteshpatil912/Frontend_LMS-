<template><QuizListPage title="Quiz Management" description="Administer assessment content across LMS courses." create-to="/admin/quizzes/create" base-path="/admin/quizzes" :store="store" /></template>
<script setup>
import QuizListPage from '@/views/shared/QuizListPage.vue'
import { useTeacherQuizStore } from '@/stores/teacher/quizStore'
const store = useTeacherQuizStore()
</script>
