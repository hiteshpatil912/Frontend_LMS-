<template><QuizFormPage title="Edit Quiz" description="Update quiz settings, questions, and answer keys." base-path="/teacher/quizzes" :store="store" :course-store="courseStore" is-edit /></template>
<script setup>
import QuizFormPage from '@/views/shared/QuizFormPage.vue'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'
import { useTeacherQuizStore } from '@/stores/teacher/quizStore'
const store = useTeacherQuizStore()
const courseStore = useTeacherCourseStore()
</script>
