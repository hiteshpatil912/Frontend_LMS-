<template>
  <ResourcePanel title="Content Library" description="Centralized course assets, templates, and media inventory." :columns="columns" :rows="rows" />
</template>
<script setup>
import ResourcePanel from '@/components/ResourcePanel.vue'
const columns = [{ key: 'name', label: 'Asset' }, { key: 'type', label: 'Type' }, { key: 'owner', label: 'Owner' }, { key: 'status', label: 'Status' }]
const rows = [
  { id: 1, name: 'Onboarding checklist', type: 'Template', owner: 'Admin', status: 'active' },
  { id: 2, name: 'Course launch deck', type: 'Slides', owner: 'Ops', status: 'active' },
  { id: 3, name: 'Accessibility guide', type: 'Document', owner: 'QA', status: 'reviewing' }
]
</script>
