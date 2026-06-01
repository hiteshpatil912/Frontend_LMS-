<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Admin workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Users</h1>
        <p class="mt-1 text-sm text-slate-500">Manage learner, teacher, and admin access.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="users.loading"
        @click="loadUsers"
      >
        Refresh
      </button>
    </div>

    <div v-if="users.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ users.error.message }}
    </div>

    <div v-if="users.loading" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div v-for="item in 6" :key="item" class="grid gap-4 border-b border-slate-100 p-5 md:grid-cols-5">
        <div class="h-4 animate-pulse rounded bg-slate-200"></div>
        <div class="h-4 animate-pulse rounded bg-slate-100 md:col-span-2"></div>
        <div class="h-4 animate-pulse rounded bg-slate-200"></div>
        <div class="h-4 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>

    <div v-else-if="users.hasUsers" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in users.users" :key="user.id" class="hover:bg-slate-50">
              <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-900">{{ user.name }}</td>
              <td class="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{{ user.email }}</td>
              <td class="whitespace-nowrap px-5 py-4">
                <select
                  :value="user.role"
                  class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize text-slate-700"
                  :disabled="users.savingId === user.id"
                  @change="changeRole(user.id, $event.target.value)"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="whitespace-nowrap px-5 py-4">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
                  :class="user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="whitespace-nowrap px-5 py-4">
                <button
                  type="button"
                  class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="users.savingId === user.id"
                  @click="toggleStatus(user)"
                >
                  {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No users found.
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminPanelUserStore } from '@/stores/admin/adminUserStore'

const users = useAdminPanelUserStore()

const loadUsers = async () => {
  try {
    await users.fetchUsers()
  } catch {
    // Store owns the rendered error state.
  }
}

const changeRole = async (id, role) => {
  try {
    await users.updateUserRole(id, role)
  } catch {
    // Store owns the rendered error state.
  }
}

const toggleStatus = async (user) => {
  const nextStatus = user.status === 'active' ? 'inactive' : 'active'

  try {
    await users.toggleUserStatus(user.id, nextStatus)
  } catch {
    // Store owns the rendered error state.
  }
}

onMounted(loadUsers)
</script>
