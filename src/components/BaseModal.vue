<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-40" @close="$emit('close')">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-slate-950/45" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-200 ease-out" enter-from="scale-95 opacity-0" enter-to="scale-100 opacity-100" leave="duration-150 ease-in" leave-from="scale-100 opacity-100" leave-to="scale-95 opacity-0">
            <DialogPanel class="w-full max-w-lg rounded-lg bg-white p-6 shadow-soft">
              <DialogTitle class="text-lg font-semibold text-slate-950">{{ title }}</DialogTitle>
              <div class="mt-5">
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

defineEmits(['close'])
defineProps({
  open: Boolean,
  title: {
    type: String,
    required: true
  }
})
</script>
