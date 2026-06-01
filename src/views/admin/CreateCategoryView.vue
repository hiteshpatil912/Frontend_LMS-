<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Course organization</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Create category</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Add a parent or child category that can be used for course assignment and student filtering.</p>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <CategoryForm :parent-options="store.categories" :saving="store.saving" submit-label="Create category" @submit="createCategory" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import CategoryForm from '@/components/category/CategoryForm.vue'
import { useAdminCategoryStore } from '@/stores/admin/categoryStore'

const router = useRouter()
const store = useAdminCategoryStore()

const createCategory = async (payload) => {
  await store.createCategory(payload)
  router.push('/admin/categories')
}

onMounted(() => {
  if (!store.categories.length) store.fetchCategories()
})
</script>
