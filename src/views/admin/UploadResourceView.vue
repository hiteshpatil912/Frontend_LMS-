<template>
  <ResourceUploadPage :store="resourceStore" :course-store="courseStore" :lesson-store="lessonStore" cancel-to="/admin/resources" eyebrow="Admin content library" />
</template>

<script setup>
import ResourceUploadPage from '@/views/shared/ResourceUploadPage.vue'
import { useAdminCoursesStore } from '@/stores/admin/coursesStore'
import { useAdminLessonStore } from '@/stores/admin/lessonStore'
import { useAdminResourceStore } from '@/stores/admin/resourceStore'

const resourceStore = useAdminResourceStore()
const courseStore = useAdminCoursesStore()
const lessonStore = useAdminLessonStore()
</script>
