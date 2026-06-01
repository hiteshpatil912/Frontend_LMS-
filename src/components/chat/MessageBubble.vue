<template>
  <div class="flex" :class="message.mine ? 'justify-end' : 'justify-start'">
    <div class="max-w-[78%] rounded-lg px-4 py-3 shadow-sm" :class="message.mine ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-800'">
      <p class="text-sm">{{ message.body }}</p>
      <p v-if="message.attachmentName" class="mt-2 rounded bg-white/15 px-2 py-1 text-xs">{{ message.attachmentName }}</p>
      <div class="mt-2 flex items-center justify-between gap-3 text-xs" :class="message.mine ? 'text-brand-50' : 'text-slate-500'">
        <span>{{ message.senderName }}</span>
        <time>{{ time }}</time>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ message: { type: Object, required: true } })
const time = computed(() => new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(props.message.createdAt)))
</script>
