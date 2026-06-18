<template>
  <div class="flex" :class="message.mine ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[78%] rounded-lg px-4 py-3 shadow-sm"
      :class="
        message.mine
          ? 'bg-brand-600 text-white'
          : 'border border-slate-200 bg-white text-slate-800'
      "
    >
      <p class="text-sm">{{ message.body || message.message }}</p>
      <p v-if="message.attachmentName" class="mt-2 rounded bg-white/15 px-2 py-1 text-xs">
        {{ message.attachmentName }}
      </p>
      <div class="mt-2 flex items-center justify-between gap-3 text-xs">
        <time>{{ time }}</time>
      </div>
      <div v-if="message.mine" class="mt-1 text-xs text-right">
        <span v-if="message.seen_at" class="text-brand-100"> ✓✓ Seen </span>

        <span v-else class="text-slate-400"> ✓ Sent </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const time = computed(() => {
  const value = props.message.created_at || props.message.createdAt;

  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
});
</script>
