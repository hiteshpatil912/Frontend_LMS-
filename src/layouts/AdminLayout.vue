<template>
  <RoleLayout role="admin" title="Admin Dashboard" :navigation="navigation">
    <RouterView />
  </RoleLayout>
</template>

<script setup>
import { AcademicCapIcon, HomeIcon, UsersIcon } from '@heroicons/vue/24/outline'
import RoleLayout from '@/layouts/RoleLayout.vue'

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: HomeIcon },
  { name: 'Users', to: '/admin/users', icon: UsersIcon },
  { name: 'Courses', to: '/admin/courses', icon: AcademicCapIcon }
]
</script>
