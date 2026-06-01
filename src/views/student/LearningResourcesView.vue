<template>
  <section class="space-y-6">
    <ResourceListPage v-if="!route.params.id" :store="store" eyebrow="Learning resources" student-mode />

    <div v-else class="space-y-6">
      <div>
        <p class="text-sm font-medium text-brand-700">Learning resources</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Resource preview</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Preview notes and download available course materials.</p>
      </div>

      <div v-if="store.loading" class="h-80 animate-pulse rounded-lg bg-slate-200"></div>
      <EmptyResourceState v-else-if="!store.currentResource" title="Resource not found" message="The requested resource is unavailable or no longer published." />
      <div v-else class="grid gap-5 lg:grid-cols-[1fr_320px]">
        <PDFPreviewCard :file-name="store.currentResource.fileName" :file-type="store.currentResource.fileType" :file-size="store.currentResource.fileSize" />
        <ResourceCard :resource="store.currentResource" :downloading="store.downloading" @download="store.downloadResource" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import EmptyResourceState from '@/components/resource/EmptyResourceState.vue'
import PDFPreviewCard from '@/components/resource/PDFPreviewCard.vue'
import ResourceCard from '@/components/resource/ResourceCard.vue'
import ResourceListPage from '@/views/shared/ResourceListPage.vue'
import { useStudentLearningResourceStore } from '@/stores/student/learningResourceStore'

const route = useRoute()
const store = useStudentLearningResourceStore()

const loadResource = () => {
  if (route.params.id) {
    store.fetchSingleResource(route.params.id)
  }
}

onMounted(loadResource)
watch(() => route.params.id, loadResource)
</script>
