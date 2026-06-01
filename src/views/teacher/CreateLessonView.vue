<template>
  <LessonCreatePage
    title="Create Lesson"
    description="Upload video content, set ordering, and attach the lesson to your course."
    :cancel-to="`/teacher/admin/courses/${route.params.courseId}/lessons`"
    :lesson-store="lessonStore"
    :course-store="courseStore"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'
import LessonCreatePage from '@/views/shared/LessonCreatePage.vue'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'
import { useTeacherLessonStore } from '@/stores/teacher/lessonStore'

const route = useRoute()
const lessonStore = useTeacherLessonStore()
const courseStore = useTeacherCourseStore()
</script>
