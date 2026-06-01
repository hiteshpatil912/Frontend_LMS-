<template>
  <CourseCreatePage
    title="Create Course"
    description="Draft a new course and prepare it for LMS publishing."
    cancel-to="/teacher/admin/courses"
    :store="store"
  />
</template>

<script setup>
import CourseCreatePage from '@/views/shared/CourseCreatePage.vue'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'

const store = useTeacherCourseStore()
</script>
