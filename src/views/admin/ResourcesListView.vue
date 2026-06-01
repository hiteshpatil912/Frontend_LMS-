<template>
  <ResourceListPage :store="store" upload-to="/admin/resources/upload" eyebrow="Admin content library" manageable />
</template>

<script setup>
import ResourceListPage from '@/views/shared/ResourceListPage.vue'
import { useAdminResourceStore } from '@/stores/admin/resourceStore'

const store = useAdminResourceStore()
</script>
