<template>
  <div class="flex items-center gap-1">
    <button
      v-for="star in 5"
      :key="star"
      class="focus-ring rounded p-1 transition hover:scale-110"
      type="button"
      :aria-label="`${star} star rating`"
      @click="$emit('update:modelValue', star)"
      @mouseenter="hovered = star"
      @mouseleave="hovered = 0"
    >
      <StarIcon :class="star <= activeRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'" class="size-7 transition-colors" />
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { StarIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:modelValue'])

const hovered = ref(0)
const activeRating = computed(() => hovered.value || props.modelValue)
</script>
