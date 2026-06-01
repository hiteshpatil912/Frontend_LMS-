<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Lessons management</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ title }}</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">{{ description }}</p>
      </div>
      <div class="flex gap-2">
        <button class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50" type="button" :class="viewMode === 'table' ? 'bg-slate-100' : ''" @click="viewMode = 'table'">
          <TableCellsIcon class="size-5" />
        </button>
        <button class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50" type="button" :class="viewMode === 'grid' ? 'bg-slate-100' : ''" @click="viewMode = 'grid'">
          <Squares2X2Icon class="size-5" />
        </button>
        <RouterLink class="focus-ring inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="createTo">Create lesson</RouterLink>
      </div>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Course lessons</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ lessons.length }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Published</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ publishedCount }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Next order</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ nextOrder }}</p>
      </div>
    </div>

    <EmptyLessonState v-if="!store.loading && !lessons.length" :create-to="createTo" />
    <LessonTable v-else-if="viewMode === 'table'" :lessons="lessons" :loading="store.loading" />
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <template v-if="store.loading">
        <div v-for="item in 6" :key="item" class="h-40 animate-pulse rounded-lg bg-slate-200"></div>
      </template>
      <LessonCard v-for="lesson in lessons" v-else :key="lesson.id" :lesson="lesson" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/vue/24/outline'
import EmptyLessonState from '@/components/lesson/EmptyLessonState.vue'
import LessonCard from '@/components/lesson/LessonCard.vue'
import LessonTable from '@/components/lesson/LessonTable.vue'

const props = defineProps({
  title: String,
  description: String,
  createTo: String,
  store: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const viewMode = ref('table')
const lessons = computed(() => props.store.lessonsByCourse(route.params.courseId))
const publishedCount = computed(() => lessons.value.filter((lesson) => lesson.status === 'published').length)
const nextOrder = computed(() => Math.max(0, ...lessons.value.map((lesson) => Number(lesson.order))) + 1)

onMounted(() => {
  props.store.fetchLessons(route.params.courseId)
})
</script>
