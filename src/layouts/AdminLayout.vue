<template>
  <RoleLayout role="admin" title="Admin Dashboard" :navigation="navigation">
    <RouterView />
  </RoleLayout>
</template>

<script setup>
import { AcademicCapIcon, HomeIcon, UsersIcon, BookOpenIcon, QuestionMarkCircleIcon, CreditCardIcon, StarIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import RoleLayout from '@/layouts/RoleLayout.vue'

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: HomeIcon },
  { name: 'Users', to: '/admin/users', icon: UsersIcon },
  { name: 'Courses', to: '/admin/courses', icon: AcademicCapIcon },
  { name: 'Lessons', to: '/admin/lessons', icon: BookOpenIcon },
  { name: 'Quizzes', to: '/admin/quizzes', icon: QuestionMarkCircleIcon },
  { name: 'Orders', to: '/admin/orders', icon: CreditCardIcon },
  { name: 'Reviews', to: '/admin/reviews', icon: StarIcon },
  { name: 'Reports', to: '/admin/reports', icon: ChartBarIcon }
]
</script>
