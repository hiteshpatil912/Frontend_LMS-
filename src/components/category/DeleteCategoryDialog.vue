<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-950/40" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-150 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <DialogTitle class="text-lg font-semibold text-slate-950">Delete category</DialogTitle>
              <DialogDescription class="mt-2 text-sm text-slate-500">
                This will delete {{ category?.name || 'this category' }} and move child categories to the root level.
              </DialogDescription>
              <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" type="button" @click="$emit('close')">
                  Cancel
                </button>
                <button class="focus-ring rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70" type="button" :disabled="loading" @click="$emit('confirm')">
                  {{ loading ? 'Deleting...' : 'Delete category' }}
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

defineProps({
  open: {
    type: Boolean,
    default: false
  },
  category: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'confirm'])
</script>
