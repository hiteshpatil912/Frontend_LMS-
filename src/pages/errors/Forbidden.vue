<template>
  <section class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-soft">
      <p class="text-sm font-semibold text-brand-700">403</p>
      <h1 class="mt-2 text-2xl font-semibold text-slate-950">Access denied</h1>
      <p class="mt-3 text-sm text-slate-500">
        You do not have permission to access this page.
      </p>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <RouterLink
          :to="auth.redirectPath"
          class="inline-flex justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Go to Dashboard
        </RouterLink>
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="logout"
        >
          Login Again
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth/authStore'
import { useAuth } from '@/composables/useAuth'

const auth = useAuthStore()
const { logout } = useAuth()
</script>
