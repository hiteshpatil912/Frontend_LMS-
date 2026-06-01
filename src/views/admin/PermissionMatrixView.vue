<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">RBAC</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Permission Matrix</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">
          Review and adjust role-permission mapping for LMS modules and protected routes.
        </p>
      </div>
      <button class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" type="button" @click="refresh">
        Refresh
      </button>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message || permissionsStore.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800'">
          {{ alert.message || permissionsStore.errors.general }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Roles</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ rolesStore.totalRoles }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Permissions</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ permissionsStore.permissions.length }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Guarded modules</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">7</p>
      </div>
    </div>

    <PermissionMatrixTable :roles="rolesStore.roles" :permissions="permissionsStore.permissions" :loading="rolesStore.loading || permissionsStore.loading" @toggle="togglePermission" />
  </section>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import PermissionMatrixTable from '@/components/admin/PermissionMatrixTable.vue'
import { useAdminPermissionsStore } from '@/stores/admin/permissionsStore'
import { useAdminRolesStore } from '@/stores/admin/rolesStore'

const rolesStore = useAdminRolesStore()
const permissionsStore = useAdminPermissionsStore()
const alert = reactive({
  message: '',
  tone: 'success'
})

const refresh = () => {
  rolesStore.fetchRoles()
  permissionsStore.fetchPermissions()
}

onMounted(refresh)

const togglePermission = async (role, permission) => {
  alert.message = ''
  const permissions = role.permissions.includes(permission)
    ? role.permissions.filter((item) => item !== permission)
    : [...role.permissions, permission]

  try {
    await rolesStore.updateRole(role.id, {
      name: role.name,
      permissions
    })
    await permissionsStore.assignPermissions(role.name, permissions)
    alert.tone = 'success'
    alert.message = `${role.name} permissions updated.`
  } catch {
    alert.tone = 'error'
    alert.message = rolesStore.errors.general || permissionsStore.errors.general || 'Unable to update permission mapping.'
  }
}
</script>
