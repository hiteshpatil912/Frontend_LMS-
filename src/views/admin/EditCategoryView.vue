<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Course organization</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Edit category</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Update category hierarchy, metadata, visibility, and course discovery details.</p>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div v-if="store.loading" class="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <div v-for="item in 5" :key="item" class="h-12 animate-pulse rounded-lg bg-slate-100"></div>
    </div>

    <CategoryForm
      v-else-if="store.currentCategory"
      :initial-value="store.currentCategory"
      :parent-options="store.parentOptions(route.params.id)"
      :saving="store.saving"
      submit-label="Update category"
      @submit="updateCategory"
    />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import CategoryForm from '@/components/category/CategoryForm.vue'
import { useAdminCategoryStore } from '@/stores/admin/categoryStore'

const route = useRoute()
const router = useRouter()
const store = useAdminCategoryStore()

const updateCategory = async (payload) => {
  await store.updateCategory(route.params.id, payload)
  router.push('/admin/categories')
}

onMounted(() => store.fetchSingleCategory(route.params.id))
</script>
