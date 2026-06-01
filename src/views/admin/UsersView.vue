<template>
  <ResourcePanel title="Users" description="Manage learners, instructors, and staff accounts." :columns="columns" :rows="store.items" />
</template>
<script setup>
import ResourcePanel from '@/components/ResourcePanel.vue'
import { useAdminUsersStore } from '@/stores/admin/usersStore'
const store = useAdminUsersStore()
const columns = [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }]
</script>
