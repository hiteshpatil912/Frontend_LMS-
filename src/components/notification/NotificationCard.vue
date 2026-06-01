<template>
  <article class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" :class="notification.read ? 'opacity-75' : 'ring-1 ring-brand-100'">
    <div class="flex items-start justify-between gap-3">
      <div>
        <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">{{ notification.type }}</span>
        <h3 class="mt-3 text-sm font-semibold text-slate-950">{{ notification.title }}</h3>
        <p class="mt-1 text-sm text-slate-500">{{ notification.message || notification.body }}</p>
      </div>
      <span v-if="!notification.read" class="mt-1 size-2 rounded-full bg-brand-600"></span>
    </div>
    <div class="mt-4 flex items-center justify-between gap-3">
      <time class="text-xs text-slate-500">{{ formattedTime }}</time>
      <button v-if="!notification.read" class="focus-ring rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50" type="button" @click="$emit('read', notification)">
        Mark read
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  notification: { type: Object, required: true }
})

defineEmits(['read'])

const formattedTime = computed(() =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(props.notification.timestamp))
)
</script>
