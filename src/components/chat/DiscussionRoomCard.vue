<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-brand-700">{{ room.course }}</p>
        <h3 class="mt-1 text-base font-semibold text-slate-950">{{ room.name }}</h3>
        <p class="mt-2 text-sm text-slate-500">{{ room.lastMessage }}</p>
      </div>
      <span v-if="room.unread" class="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">{{ room.unread }}</span>
    </div>
    <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
      <div class="rounded-lg bg-slate-50 p-3">
        <p class="text-xs text-slate-500">Participants</p>
        <p class="mt-1 font-semibold text-slate-950">{{ room.participants }}</p>
      </div>
      <div class="rounded-lg bg-slate-50 p-3">
        <p class="text-xs text-slate-500">Online</p>
        <p class="mt-1 font-semibold text-slate-950">{{ room.online }}</p>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({ room: { type: Object, required: true } })
</script>
