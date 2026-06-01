<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">{{ role === 'admin' ? 'Global messaging' : 'Course messaging' }}</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Announcements</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Send in-app announcements and prepare email notification delivery.</p>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form class="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="submit">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Title</span>
          <input v-model.trim="form.title" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        </label>
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Message</span>
          <textarea v-model.trim="form.message" class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        </label>
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Audience</span>
          <select v-model="form.audience" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="all" :disabled="role !== 'admin'">All students</option>
            <option value="course">Course students</option>
          </select>
        </label>
        <label v-if="form.audience === 'course'" class="block">
          <span class="text-sm font-medium text-slate-700">Course</span>
          <input v-model.trim="form.course" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" placeholder="UX Research Systems" />
        </label>
        <label class="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <input v-model="form.emailEnabled" class="rounded border-slate-300 text-brand-600" type="checkbox" />
          Email notification base UI
        </label>
        <button class="focus-ring w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="store.saving">
          {{ store.saving ? 'Sending...' : 'Send announcement' }}
        </button>
      </form>

      <section class="space-y-4">
        <div v-if="store.loading" class="space-y-3">
          <div v-for="item in 3" :key="item" class="h-32 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
        <EmptyNotificationState v-else-if="!store.announcements.length" title="No announcements" message="Create your first announcement to notify learners." />
        <AnnouncementCard v-for="announcement in store.announcements" v-else :key="announcement.id" :announcement="announcement" />
      </section>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import AnnouncementCard from '@/components/notification/AnnouncementCard.vue'
import EmptyNotificationState from '@/components/notification/EmptyNotificationState.vue'
import { useAnnouncementStore } from '@/stores/shared/announcementStore'

const props = defineProps({
  role: { type: String, required: true }
})

const store = useAnnouncementStore()
const form = reactive({
  title: '',
  message: '',
  audience: props.role === 'admin' ? 'all' : 'course',
  course: '',
  emailEnabled: false,
  senderRole: props.role
})

const submit = async () => {
  if (!form.title || !form.message) return
  await store.createAnnouncement({ ...form, course: form.audience === 'all' ? 'All courses' : form.course || 'Selected course' })
  form.title = ''
  form.message = ''
}

onMounted(() => store.fetchAnnouncements({ role: props.role }))
</script>
