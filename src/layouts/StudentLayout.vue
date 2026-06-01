<template>
  <RoleLayout role="student" title="Student Dashboard" :navigation="navigation">
    <RouterView />
  </RoleLayout>
</template>

<script setup>
import {
  AcademicCapIcon,
  BellIcon,
  BookmarkIcon,
  CheckBadgeIcon,
  HomeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'
import RoleLayout from '@/layouts/RoleLayout.vue'

const navigation = [
  { name: 'Dashboard', to: '/student/dashboard', icon: HomeIcon },
  { name: 'My Courses', to: '/student/my-courses', icon: AcademicCapIcon },
  { name: 'Quizzes', to: '/student/quizzes', icon: QuestionMarkCircleIcon },
  { name: 'Certificates', to: '/student/certificates', icon: CheckBadgeIcon },
  { name: 'Wishlist', to: '/student/wishlist', icon: BookmarkIcon },
  { name: 'Notifications', to: '/student/notifications', icon: BellIcon }
]
</script>
