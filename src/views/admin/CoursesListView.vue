<template>
  <CourseManagementList
    title="Course Management"
    description="Create, search, and manage the full LMS course catalog."
    create-to="/admin/courses/create"
    route-base="/admin/courses"
    :store="store"
  />
</template>

<script setup>
import CourseManagementList from '@/views/shared/CourseManagementList.vue'
import { useAdminCoursesStore } from '@/stores/admin/coursesStore'

const store = useAdminCoursesStore()
</script>
