<template>
  <ResourceUploadPage :store="resourceStore" :course-store="courseStore" :lesson-store="lessonStore" cancel-to="/teacher/resources" eyebrow="Teacher resources" />
</template>

<script setup>
import ResourceUploadPage from '@/views/shared/ResourceUploadPage.vue'
import { useTeacherCourseStore } from '@/stores/teacher/courseStore'
import { useTeacherLessonStore } from '@/stores/teacher/lessonStore'
import { useTeacherResourceStore } from '@/stores/teacher/resourceStore'

const resourceStore = useTeacherResourceStore()
const courseStore = useTeacherCourseStore()
const lessonStore = useTeacherLessonStore()
</script>
