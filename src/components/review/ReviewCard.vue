<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="flex items-center gap-1 text-amber-400">
          <StarIcon v-for="star in 5" :key="star" :class="star <= review.rating ? 'fill-amber-400' : 'fill-slate-200 text-slate-200'" class="size-4" />
        </div>
        <h3 class="mt-2 text-base font-semibold text-slate-950">{{ review.title || review.courseTitle }}</h3>
        <p class="mt-1 text-sm text-slate-500">{{ review.courseTitle }} · {{ review.studentName }}</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{{ review.createdAt }}</span>
    </div>
    <p class="mt-4 text-sm leading-6 text-slate-600">{{ review.comment }}</p>
    <div v-if="manageable" class="mt-5 flex justify-end gap-2">
      <button class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" type="button" @click="$emit('edit', review)">Edit</button>
      <button class="focus-ring rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50" type="button" @click="$emit('delete', review)">Delete</button>
    </div>
  </article>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/24/solid'

defineProps({
  review: {
    type: Object,
    required: true
  },
  manageable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete'])
</script>
