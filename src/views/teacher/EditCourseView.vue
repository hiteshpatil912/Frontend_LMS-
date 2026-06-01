<template>
  <CourseEditPage :store="store" base-path="/teacher/admin/courses" />
</template>

<script setup>
import CourseEditPage from '@/views/shared/CourseEditPage.vue'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'

const store = useTeacherCourseStore()
</script>
