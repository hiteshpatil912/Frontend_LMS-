<template>
  <div class="pointer-events-none fixed right-4 top-20 z-50 space-y-3">
    <TransitionGroup enter-active-class="transition duration-200 ease-out" enter-from-class="translate-x-6 opacity-0" enter-to-class="translate-x-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-for="toast in toasts" :key="toast.id" class="pointer-events-auto w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-950">{{ toast.title }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ toast.message }}</p>
          </div>
          <button class="text-slate-400 hover:text-slate-600" type="button" @click="$emit('dismiss', toast.id)">x</button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
defineProps({
  toasts: { type: Array, default: () => [] }
})

defineEmits(['dismiss'])
</script>
