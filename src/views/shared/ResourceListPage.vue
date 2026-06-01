<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">{{ eyebrow }}</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Learning resources</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Manage PDF notes, attachments, and course-wise learning files.</p>
      </div>
      <RouterLink v-if="manageable" class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="uploadTo">
        Upload resource
      </RouterLink>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Total resources</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.totalResources }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Published</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.publishedResources.length }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Courses covered</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ courseOptions.length }}</p>
      </div>
    </div>

    <ResourceFilter v-model:search="search" v-model:course="course" v-model:visibility="visibility" :courses="courseOptions" />

    <div class="hidden xl:block">
      <ResourceTable :resources="filteredResources" :loading="store.loading" :manageable="manageable" :downloading="store.downloading" @download="downloadResource" @delete="deleteResource" />
    </div>

    <div class="grid gap-4 xl:hidden">
      <div v-if="store.loading" class="grid gap-4 md:grid-cols-2">
        <div v-for="item in 4" :key="item" class="h-64 animate-pulse rounded-lg bg-slate-200"></div>
      </div>
      <EmptyResourceState v-else-if="!filteredResources.length" />
      <ResourceCard v-for="resource in filteredResources" v-else :key="resource.id" :resource="resource" :manageable="manageable" :downloading="store.downloading" @download="downloadResource" @delete="deleteResource" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import EmptyResourceState from '@/components/resource/EmptyResourceState.vue'
import ResourceCard from '@/components/resource/ResourceCard.vue'
import ResourceFilter from '@/components/resource/ResourceFilter.vue'
import ResourceTable from '@/components/resource/ResourceTable.vue'

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  uploadTo: {
    type: String,
    default: ''
  },
  eyebrow: {
    type: String,
    default: 'Content library'
  },
  manageable: {
    type: Boolean,
    default: false
  },
  studentMode: {
    type: Boolean,
    default: false
  }
})

const search = ref('')
const course = ref('')
const visibility = ref(props.studentMode ? 'published' : '')

const sourceResources = computed(() => (props.studentMode ? props.store.publishedResources : props.store.resources))
const courseOptions = computed(() => [...new Set(sourceResources.value.map((resource) => resource.course))])

const filteredResources = computed(() => {
  const term = search.value.toLowerCase()
  return sourceResources.value.filter((resource) => {
    const matchesSearch = !term || [resource.title, resource.description, resource.course, resource.lesson].join(' ').toLowerCase().includes(term)
    const matchesCourse = !course.value || resource.course === course.value
    const matchesVisibility = !visibility.value || resource.visibility === visibility.value
    return matchesSearch && matchesCourse && matchesVisibility
  })
})

const downloadResource = (resource) => props.store.downloadResource(resource)
const deleteResource = (resource) => props.store.deleteResource(resource.id)

onMounted(() => props.store.fetchResources())
</script>
