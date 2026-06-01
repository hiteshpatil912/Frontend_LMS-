<template><QuizFormPage title="Create Quiz" description="Build an assessment with MCQ questions and passing criteria." base-path="/teacher/quizzes" :store="store" :course-store="courseStore" /></template>
<script setup>
import QuizFormPage from '@/views/shared/QuizFormPage.vue'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'
import { useTeacherQuizStore } from '@/stores/teacher/quizStore'
const store = useTeacherQuizStore()
const courseStore = useTeacherCourseStore()
</script>
