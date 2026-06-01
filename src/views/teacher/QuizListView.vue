<template><QuizListPage title="Quizzes" description="Manage quizzes, questions, and attempts." create-to="/teacher/quizzes/create" base-path="/teacher/quizzes" :store="store" /></template>
<script setup>
import QuizListPage from '@/views/shared/QuizListPage.vue'
import { useTeacherQuizStore } from '@/stores/teacher/quizStore'
const store = useTeacherQuizStore()
</script>
