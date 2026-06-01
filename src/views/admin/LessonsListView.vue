<template>
  <LessonsManagementList
    title="Course Lessons"
    description="Manage lesson sequence, video content, and publishing status for this course."
    :create-to="`/admin/courses/${route.params.courseId}/lessons/create`"
    :store="store"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'
import LessonsManagementList from '@/views/shared/LessonsManagementList.vue'
import { useAdminLessonStore } from '@/stores/admin/lessonStore'

const route = useRoute()
const store = useAdminLessonStore()
</script>
