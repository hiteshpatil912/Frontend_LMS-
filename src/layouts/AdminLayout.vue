<template>
  <RoleLayout role="admin" title="Admin Dashboard" :navigation="visibleNavigation">
    <RouterView />
  </RoleLayout>
</template>

<script setup>
import { computed } from 'vue'
import { AcademicCapIcon, BanknotesIcon, ChartBarIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon, DocumentChartBarIcon, DocumentTextIcon, FolderIcon, HomeIcon, KeyIcon, MegaphoneIcon, QuestionMarkCircleIcon, ShieldCheckIcon, TagIcon, UsersIcon } from '@heroicons/vue/24/outline'
import RoleLayout from '@/layouts/RoleLayout.vue'
import { usePermissions } from '@/composables/usePermissions'

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: HomeIcon },
  { name: 'Users', to: '/admin/users', icon: UsersIcon, permission: 'manage_users' },
  { name: 'Roles', to: '/admin/roles', icon: ShieldCheckIcon, permission: 'manage_roles' },
  { name: 'Permissions', to: '/admin/permissions', icon: KeyIcon, permission: 'manage_roles' },
  { name: 'Announcements', to: '/admin/announcements', icon: MegaphoneIcon, permission: 'manage_settings' },
  { name: 'Chat Monitor', to: '/admin/chat', icon: ChatBubbleLeftRightIcon, permission: 'manage_settings' },
  { name: 'Courses', to: '/admin/courses', icon: AcademicCapIcon, permission: 'manage_courses' },
  { name: 'Assignments', to: '/admin/assignments', icon: DocumentTextIcon, permission: 'manage_courses' },
  { name: 'Quizzes', to: '/admin/quizzes', icon: QuestionMarkCircleIcon, permission: 'manage_courses' },
  { name: 'Reviews', to: '/admin/reviews', icon: ChatBubbleLeftRightIcon, permission: 'manage_courses' },
  { name: 'Resources', to: '/admin/resources', icon: DocumentTextIcon, permission: 'manage_courses' },
  { name: 'Categories', to: '/admin/categories', icon: TagIcon, permission: 'manage_courses' },
  { name: 'Certificates', to: '/admin/certificates', icon: CheckBadgeIcon, permission: 'manage_courses' },
  { name: 'Payments', to: '/admin/payments', icon: BanknotesIcon, permission: 'manage_payments' },
  { name: 'Transactions', to: '/admin/transactions', icon: DocumentChartBarIcon, permission: 'manage_payments' },
  { name: 'Analytics', to: '/admin/analytics', icon: ChartBarIcon, permission: 'view_analytics' },
  { name: 'Reports', to: '/admin/reports', icon: DocumentChartBarIcon, permission: 'view_analytics' },
  { name: 'Content Library', to: '/admin/library', icon: FolderIcon, permission: 'manage_settings' }
]

const { canAccess } = usePermissions()
const visibleNavigation = computed(() => navigation.filter((item) => canAccess({ permission: item.permission })))
</script>
