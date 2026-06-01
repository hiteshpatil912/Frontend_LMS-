<template>
  <CourseManagementList
    title="My Courses"
    description="Manage your course drafts, published programs, and course setup details."
    create-to="/teacher/admin/courses/create"
    route-base="/teacher/admin/courses"
    :store="store"
  />
</template>

<script setup>
import CourseManagementList from '@/views/shared/CourseManagementList.vue'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'

const store = useTeacherCourseStore()
</script>
