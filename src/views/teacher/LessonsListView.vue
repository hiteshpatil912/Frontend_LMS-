<template>
  <LessonsManagementList
    title="Course Lessons"
    description="Manage your lesson sequence, video content, and publishing status for this course."
    :create-to="`/teacher/admin/courses/${route.params.courseId}/lessons/create`"
    :store="store"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'
import LessonsManagementList from '@/views/shared/LessonsManagementList.vue'
import { useTeacherLessonStore } from '@/stores/teacher/lessonStore'

const route = useRoute()
const store = useTeacherLessonStore()
</script>
