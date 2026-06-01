<template>
  <LessonCreatePage
    title="Create Lesson"
    description="Upload video content, set ordering, and attach the lesson to its course."
    :cancel-to="`/admin/courses/${route.params.courseId}/lessons`"
    :lesson-store="lessonStore"
    :course-store="courseStore"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'
import LessonCreatePage from '@/views/shared/LessonCreatePage.vue'
import { useAdminCoursesStore } from '@/stores/admin/coursesStore'
import { useAdminLessonStore } from '@/stores/admin/lessonStore'

const route = useRoute()
const lessonStore = useAdminLessonStore()
const courseStore = useAdminCoursesStore()
</script>
