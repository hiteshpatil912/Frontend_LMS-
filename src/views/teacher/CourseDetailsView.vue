<template>
  <CourseDetailsPage :store="store" base-path="/teacher/admin/courses" />
</template>

<script setup>
import CourseDetailsPage from '@/views/shared/CourseDetailsPage.vue'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'

const store = useTeacherCourseStore()
</script>
