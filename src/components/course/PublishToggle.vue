<template>
  <button
    class="focus-ring inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
    :class="isPublished ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'"
    type="button"
    :disabled="loading"
    @click="$emit('toggle', isPublished ? 'draft' : 'published')"
  >
    <ArrowPathIcon v-if="loading" class="size-4 animate-spin" />
    <component :is="isPublished ? EyeSlashIcon : EyeIcon" v-else class="size-4" />
    {{ isPublished ? 'Move to draft' : 'Publish course' }}
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  loading: Boolean
})

defineEmits(['toggle'])

const isPublished = computed(() => props.status === 'published')
</script>
