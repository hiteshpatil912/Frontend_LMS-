<template>
  <div class="min-h-screen bg-slate-100 text-slate-950">
    <aside class="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
      <div class="border-b border-slate-200 px-6 py-5 text-lg font-semibold text-brand-700">
        Vue LMS
      </div>

      <nav class="space-y-1 px-3 py-4">
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-700"
          active-class="bg-brand-50 text-brand-700"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </aside>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <p class="text-sm font-semibold text-slate-700">
            Student Portal
          </p>
          <div class="flex items-center gap-4">
            <RouterLink to="/courses" class="text-sm font-medium text-brand-700">
              Browse Courses
            </RouterLink>
            <button
              type="button"
              class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main class="px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()

const navigation = [
  { name: 'Dashboard', to: '/student/dashboard' },
  { name: 'My Courses', to: '/student/my-courses' },
  { name: 'Quizzes', to: '/student/quizzes' },
  { name: 'Certificates', to: '/student/certificates' },
  { name: 'Wishlist', to: '/student/wishlist' },
  { name: 'Notifications', to: '/student/notifications' }
]
</script>
