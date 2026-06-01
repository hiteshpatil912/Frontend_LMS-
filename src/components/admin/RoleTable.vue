<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div v-if="loading" class="divide-y divide-slate-100">
      <div v-for="row in 3" :key="row" class="grid gap-4 p-5 md:grid-cols-[180px_1fr_120px]">
        <div class="h-5 animate-pulse rounded bg-slate-200"></div>
        <div class="h-5 animate-pulse rounded bg-slate-200"></div>
        <div class="h-5 animate-pulse rounded bg-slate-200"></div>
      </div>
    </div>

    <TransitionRoot v-else appear :show="true" as="template">
      <TransitionChild
        as="template"
        enter="duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-150 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div>
          <div v-if="!roles.length" class="px-5 py-14 text-center">
            <ShieldCheckIcon class="mx-auto size-10 text-slate-300" />
            <h3 class="mt-3 text-sm font-semibold text-slate-950">No roles found</h3>
            <p class="mt-1 text-sm text-slate-500">Try a different search term or sync roles from the API.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Permissions</th>
                  <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Count</th>
                  <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="role in roles" :key="role.id" class="align-top hover:bg-slate-50">
                  <td class="whitespace-nowrap px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div class="grid size-10 place-items-center rounded-lg bg-slate-950 text-sm font-semibold text-white">
                        {{ role.name.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-slate-950">{{ role.name }}</p>
                        <p class="text-xs text-slate-500">System role</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex max-w-2xl flex-wrap gap-2">
                      <RoleBadge v-for="permission in role.permissions" :key="permission" :label="permission" />
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">
                    {{ role.permissions.length }}
                  </td>
                  <td class="whitespace-nowrap px-5 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <RouterLink class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50" :to="`/admin/roles/${role.id}/edit`" :aria-label="`Edit ${role.name}`">
                        <PencilSquareIcon class="size-4" />
                      </RouterLink>
                      <button class="focus-ring rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50" type="button" :aria-label="`Delete ${role.name}`" @click="$emit('delete', role)">
                        <TrashIcon class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </TransitionChild>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PencilSquareIcon, ShieldCheckIcon, TrashIcon } from '@heroicons/vue/24/outline'
import RoleBadge from '@/components/admin/RoleBadge.vue'

defineEmits(['delete'])
defineProps({
  roles: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
