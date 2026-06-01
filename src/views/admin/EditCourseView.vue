<template>
  <CourseEditPage :store="store" base-path="/admin/courses" />
</template>

<script setup>
import CourseEditPage from '@/views/shared/CourseEditPage.vue'
import { useAdminCoursesStore } from '@/stores/admin/coursesStore'

const store = useAdminCoursesStore()
</script>
