<template>
  <div class="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm">
    Time left: {{ minutes }}:{{ seconds }}
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({ duration: { type: Number, required: true } })
const emit = defineEmits(['expired'])
const remaining = ref(props.duration * 60)
let timer
const minutes = computed(() => String(Math.floor(remaining.value / 60)).padStart(2, '0'))
const seconds = computed(() => String(remaining.value % 60).padStart(2, '0'))

onMounted(() => {
  timer = window.setInterval(() => {
    remaining.value -= 1
    if (remaining.value <= 0) {
      window.clearInterval(timer)
      emit('expired')
    }
  }, 1000)
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>
