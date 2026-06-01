<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Course organization</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Categories</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Create nested course categories, manage active learning groups, and keep discovery organized.</p>
      </div>
      <RouterLink class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" to="/admin/categories/create">
        Create category
      </RouterLink>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0 -translate-y-1" enter-to="opacity-100 translate-y-0" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div :class="alert.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'" class="rounded-lg border px-4 py-3 text-sm">
          {{ alert.message }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Total categories</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.totalCategories }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Active categories</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.activeCategories.length }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Assigned courses</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ assignedCourses }}</p>
      </div>
    </div>

    <div class="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <CategoryTree :nodes="store.categoryTree" :loading="store.loading" />
      <div class="space-y-4">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Search categories</span>
          <input v-model.trim="search" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="search" placeholder="Search by name, slug, or description" />
        </label>
        <CategoryTable :categories="filteredCategories" :all-categories="store.categories" :loading="store.loading" @delete="requestDelete" />
      </div>
    </div>

    <DeleteCategoryDialog :open="deleteDialogOpen" :category="selectedCategory" :loading="store.deleting" @close="closeDeleteDialog" @confirm="deleteCategory" />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import CategoryTable from '@/components/category/CategoryTable.vue'
import CategoryTree from '@/components/category/CategoryTree.vue'
import DeleteCategoryDialog from '@/components/category/DeleteCategoryDialog.vue'
import { useAdminCategoryStore } from '@/stores/admin/categoryStore'

const store = useAdminCategoryStore()
const search = ref('')
const deleteDialogOpen = ref(false)
const selectedCategory = ref(null)
const alert = reactive({
  type: 'success',
  message: ''
})

const assignedCourses = computed(() => store.categories.reduce((sum, category) => sum + Number(category.courses || 0), 0))

const filteredCategories = computed(() => {
  const term = search.value.toLowerCase()
  if (!term) return store.categories
  return store.categories.filter((category) => [category.name, category.slug, category.description].join(' ').toLowerCase().includes(term))
})

const requestDelete = (category) => {
  selectedCategory.value = category
  deleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
  deleteDialogOpen.value = false
  selectedCategory.value = null
}

const deleteCategory = async () => {
  try {
    await store.deleteCategory(selectedCategory.value.id)
    alert.type = 'success'
    alert.message = 'Category deleted successfully.'
    closeDeleteDialog()
  } catch (error) {
    alert.type = 'error'
    alert.message = store.errors.general || 'Unable to delete category.'
  }
}

onMounted(() => store.fetchCategories())
</script>
