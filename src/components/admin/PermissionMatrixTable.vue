<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div v-if="loading" class="space-y-3 p-5">
      <div v-for="row in 5" :key="row" class="h-10 animate-pulse rounded bg-slate-200"></div>
    </div>

    <TransitionRoot v-else appear :show="true" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="sticky left-0 bg-slate-50 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Permission</th>
                <th v-for="role in roles" :key="role.name" class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {{ role.name }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="permission in permissions" :key="permission" class="hover:bg-slate-50">
                <td class="sticky left-0 bg-white px-5 py-4">
                  <PermissionBadge :permission="permission" />
                </td>
                <td v-for="role in roles" :key="`${role.name}-${permission}`" class="px-5 py-4 text-center">
                  <button
                    class="focus-ring inline-flex items-center justify-center rounded-full p-1"
                    :class="role.permissions.includes(permission) ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100'"
                    type="button"
                    :aria-label="`${role.permissions.includes(permission) ? 'Remove' : 'Assign'} ${permission} for ${role.name}`"
                    @click="$emit('toggle', role, permission)"
                  >
                    <CheckCircleIcon v-if="role.permissions.includes(permission)" class="size-6" />
                    <XCircleIcon v-else class="size-6" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TransitionChild>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import PermissionBadge from '@/components/admin/PermissionBadge.vue'

defineEmits(['toggle'])
defineProps({
  roles: {
    type: Array,
    required: true
  },
  permissions: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
