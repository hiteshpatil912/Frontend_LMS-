<template>
  <CourseCreatePage
    title="Create Course"
    description="Add course details, instructor ownership, pricing, level, and publishing status."
    cancel-to="/admin/courses"
    :store="store"
  />
</template>

<script setup>
import CourseCreatePage from '@/views/shared/CourseCreatePage.vue'
import { useAdminCoursesStore } from '@/stores/admin/coursesStore'

const store = useAdminCoursesStore()
</script>
