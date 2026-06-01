<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Course discussions</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Discussion Rooms</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Course-based discussion spaces for teacher announcements and student replies.</p>
      </div>
      <button class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" type="button" @click="createRoom">
        Create room
      </button>
    </div>

    <div v-if="chatStore.loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="item in 3" :key="item" class="h-48 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <EmptyChatState v-else-if="!chatStore.discussionRooms.length" title="No discussion rooms" message="Create course rooms to host group conversations." />
    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DiscussionRoomCard v-for="room in chatStore.discussionRooms" :key="room.id" :room="room" />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import DiscussionRoomCard from '@/components/chat/DiscussionRoomCard.vue'
import EmptyChatState from '@/components/chat/EmptyChatState.vue'
import { useChatStore } from '@/stores/shared/chatStore'

const props = defineProps({ role: { type: String, default: 'student' } })
const chatStore = useChatStore()

const createRoom = () =>
  chatStore.createDiscussionRoom({
    courseId: Date.now(),
    course: props.role === 'teacher' ? 'Teacher course' : 'Student cohort',
    name: props.role === 'teacher' ? 'New course discussion' : 'Study group discussion'
  })

onMounted(() => chatStore.fetchChats({ role: props.role }))
</script>
