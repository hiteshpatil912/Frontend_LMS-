<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-950/45" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-200 ease-out" enter-from="scale-95 opacity-0" enter-to="scale-100 opacity-100" leave="duration-150 ease-in" leave-from="scale-100 opacity-100" leave-to="scale-95 opacity-0">
            <DialogPanel class="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
              <div class="flex gap-4">
                <div class="grid size-11 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
                  <ExclamationTriangleIcon class="size-6" />
                </div>
                <div>
                  <DialogTitle class="text-lg font-semibold text-slate-950">Delete role</DialogTitle>
                  <DialogDescription class="mt-2 text-sm text-slate-500">
                    This will permanently delete <span class="font-medium text-slate-700">{{ role?.name }}</span>. Users assigned to this role may lose access.
                  </DialogDescription>
                </div>
              </div>

              <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" type="button" @click="$emit('close')">
                  Cancel
                </button>
                <button
                  class="focus-ring inline-flex justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                  type="button"
                  :disabled="deleting"
                  @click="$emit('confirm')"
                >
                  <ArrowPathIcon v-if="deleting" class="mr-2 size-4 animate-spin" />
                  {{ deleting ? 'Deleting...' : 'Delete role' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogDescription, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineEmits(['close', 'confirm'])
defineProps({
  open: {
    type: Boolean,
    default: false
  },
  role: {
    type: Object,
    default: null
  },
  deleting: {
    type: Boolean,
    default: false
  }
})
</script>
