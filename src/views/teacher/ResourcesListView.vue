<template>
  <ResourceListPage :store="store" upload-to="/teacher/resources/upload" eyebrow="Teacher resources" manageable />
</template>

<script setup>
import ResourceListPage from '@/views/shared/ResourceListPage.vue'
import { useTeacherResourceStore } from '@/stores/teacher/resourceStore'

const store = useTeacherResourceStore()
</script>
