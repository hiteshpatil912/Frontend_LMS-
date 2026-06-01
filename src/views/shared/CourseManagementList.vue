<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Course operations</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ title }}</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">{{ description }}</p>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row lg:items-end">
        <div class="w-full sm:w-80">
          <label class="text-sm font-medium text-slate-700" for="course-search">Search courses</label>
          <div class="relative mt-1">
            <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input id="course-search" v-model.trim="search" class="focus-ring w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm" type="search" placeholder="Search title, category, instructor" />
          </div>
        </div>
        <div class="flex gap-2">
          <button class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50" type="button" :class="viewMode === 'table' ? 'bg-slate-100' : ''" @click="viewMode = 'table'">
            <TableCellsIcon class="size-5" />
          </button>
          <button class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50" type="button" :class="viewMode === 'grid' ? 'bg-slate-100' : ''" @click="viewMode = 'grid'">
            <Squares2X2Icon class="size-5" />
          </button>
          <RouterLink class="focus-ring inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="createTo">
            Create course
          </RouterLink>
        </div>
      </div>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {{ store.errors.general }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Total courses</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ store.totalCourses }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Published</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ store.publishedCourses.length }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Visible results</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ filteredCourses.length }}</p>
      </div>
    </div>

    <EmptyCourseState v-if="!store.loading && !filteredCourses.length" :create-to="createTo" />
    <CourseTable v-else-if="viewMode === 'table'" :courses="filteredCourses" :loading="store.loading" :route-base="routeBase" />
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <template v-if="store.loading">
        <div v-for="item in 6" :key="item" class="h-72 animate-pulse rounded-lg bg-slate-200"></div>
      </template>
      <CourseCard v-for="course in filteredCourses" v-else :key="course.id" :course="course" :route-base="routeBase" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { MagnifyingGlassIcon, Squares2X2Icon, TableCellsIcon } from '@heroicons/vue/24/outline'
import CourseCard from '@/components/course/CourseCard.vue'
import CourseTable from '@/components/course/CourseTable.vue'
import EmptyCourseState from '@/components/course/EmptyCourseState.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createTo: {
    type: String,
    required: true
  },
  store: {
    type: Object,
    required: true
  },
  routeBase: {
    type: String,
    required: true
  }
})

const search = ref('')
const viewMode = ref('table')

const filteredCourses = computed(() => {
  const query = search.value.toLowerCase()
  if (!query) return props.store.courses

  return props.store.courses.filter((course) =>
    [course.title, course.category, course.instructor, course.status, course.level]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

onMounted(() => {
  props.store.fetchCourses()
})
</script>
