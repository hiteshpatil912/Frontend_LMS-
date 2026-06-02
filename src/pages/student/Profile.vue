<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-950">Profile</h1>
      <p class="mt-1 text-sm text-slate-500">Your LearnSphere account information.</p>
    </div>

    <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="grid size-20 place-items-center rounded-full bg-slate-900 text-xl font-semibold text-white">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <h2 class="truncate text-xl font-semibold text-slate-950">{{ displayName }}</h2>
            <p class="mt-1 truncate text-sm text-slate-500">{{ displayEmail }}</p>
          </div>
        </div>
      </div>

      <dl class="divide-y divide-slate-100">
        <div class="grid gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Name</dt>
          <dd class="text-sm font-semibold text-slate-950 sm:col-span-2">{{ displayName }}</dd>
        </div>
        <div class="grid gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Email</dt>
          <dd class="text-sm font-semibold text-slate-950 sm:col-span-2">{{ displayEmail }}</dd>
        </div>
        <div class="grid gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Role</dt>
          <dd class="text-sm font-semibold capitalize text-slate-950 sm:col-span-2">{{ displayRole }}</dd>
        </div>
      </dl>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth/authStore'

const auth = useAuthStore()
const user = computed(() => auth.user || {})

const displayName = computed(() => user.value.name || 'Learner')
const displayEmail = computed(() => user.value.email || 'No email available')
const displayRole = computed(() => user.value.role || 'student')
const initials = computed(() =>
  displayName.value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'LS'
)
</script>
