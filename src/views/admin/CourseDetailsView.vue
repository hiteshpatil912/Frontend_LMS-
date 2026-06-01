<template>
  <CourseDetailsPage :store="store" base-path="/admin/courses" />
</template>

<script setup>
import CourseDetailsPage from '@/views/shared/CourseDetailsPage.vue'
import { useAdminCoursesStore } from '@/stores/admin/coursesStore'

const store = useAdminCoursesStore()
</script>
