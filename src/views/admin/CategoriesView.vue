<template>
  <ResourcePanel title="Categories" description="Organize course taxonomy and catalog visibility." :columns="columns" :rows="store.items" />
</template>
<script setup>
import ResourcePanel from '@/components/ResourcePanel.vue'
import { useAdminCategoryStore } from '@/stores/admin/categoryStore'
const store = useAdminCategoryStore()
const columns = [{ key: 'name', label: 'Category' }, { key: 'courses', label: 'Courses' }, { key: 'status', label: 'Status' }]
</script>
