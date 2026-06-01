<template><QuizFormPage title="Create Quiz" description="Create an LMS assessment for any course." base-path="/admin/quizzes" :store="store" :course-store="courseStore" /></template>
<script setup>
import QuizFormPage from '@/views/shared/QuizFormPage.vue'
import { useAdminCoursesStore } from '@/stores/admin/coursesStore'
import { useTeacherQuizStore } from '@/stores/teacher/quizStore'
const store = useTeacherQuizStore()
const courseStore = useAdminCoursesStore()
</script>
