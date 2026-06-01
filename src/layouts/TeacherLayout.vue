<template>
  <RoleLayout role="teacher" title="Teacher Dashboard" :navigation="navigation">
    <RouterView />
  </RoleLayout>
</template>

<script setup>
import { AcademicCapIcon, BanknotesIcon, ChartBarIcon, ChatBubbleLeftRightIcon, ClipboardDocumentCheckIcon, DocumentTextIcon, HomeIcon, MegaphoneIcon, QuestionMarkCircleIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import RoleLayout from '@/layouts/RoleLayout.vue'

const navigation = [
  { name: 'Dashboard', to: '/teacher/dashboard', icon: HomeIcon },
  { name: 'Courses', to: '/teacher/admin/courses', icon: AcademicCapIcon },
  { name: 'Students', to: '/teacher/students', icon: UserGroupIcon },
  { name: 'Assignments', to: '/teacher/assignments', icon: ClipboardDocumentCheckIcon },
  { name: 'Announcements', to: '/teacher/announcements', icon: MegaphoneIcon },
  { name: 'Chat', to: '/teacher/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Discussions', to: '/teacher/discussions', icon: UserGroupIcon },
  { name: 'Quizzes', to: '/teacher/quizzes', icon: QuestionMarkCircleIcon },
  { name: 'Analytics', to: '/teacher/analytics', icon: ChartBarIcon },
  { name: 'Reviews', to: '/teacher/reviews', icon: ChatBubbleLeftRightIcon },
  { name: 'Resources', to: '/teacher/resources', icon: DocumentTextIcon },
  { name: 'Earnings', to: '/teacher/earnings', icon: BanknotesIcon }
]
</script>
