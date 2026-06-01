<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-200 px-5 py-4">
      <h3 class="text-base font-semibold text-slate-950">Categories</h3>
      <p class="mt-1 text-sm text-slate-500">Organize courses into parent and child learning groups.</p>
    </div>

    <div v-if="loading" class="space-y-3 p-5">
      <div v-for="item in 5" :key="item" class="h-14 animate-pulse rounded-lg bg-slate-100"></div>
    </div>

    <div v-else-if="!categories.length" class="p-8 text-center">
      <p class="text-sm font-medium text-slate-700">No categories found</p>
      <p class="mt-1 text-sm text-slate-500">Create a category or adjust your search filter.</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-5 py-3 font-semibold">Category</th>
            <th class="px-5 py-3 font-semibold">Parent</th>
            <th class="px-5 py-3 font-semibold">Courses</th>
            <th class="px-5 py-3 font-semibold">Status</th>
            <th class="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="category in categories" :key="category.id" class="align-top">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <img class="size-11 rounded-lg object-cover" :src="category.thumbnail" :alt="category.name" />
                <div>
                  <p class="font-semibold text-slate-950">{{ category.name }}</p>
                  <p class="mt-1 text-xs text-slate-500">/{{ category.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 text-slate-600">{{ parentName(category.parentId) }}</td>
            <td class="px-5 py-4 text-slate-600">{{ category.courses }}</td>
            <td class="px-5 py-4">
              <CategoryBadge :value="category.status" type="status" />
            </td>
            <td class="px-5 py-4">
              <div class="flex justify-end gap-2">
                <RouterLink class="focus-ring rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50" :to="`/admin/categories/${category.id}/edit`">
                  Edit
                </RouterLink>
                <button class="focus-ring rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50" type="button" @click="$emit('delete', category)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import CategoryBadge from '@/components/category/CategoryBadge.vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  allCategories: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])

const parentName = (parentId) => {
  if (!parentId) return 'Root'
  return props.allCategories.find((category) => String(category.id) === String(parentId))?.name || 'Root'
}
</script>
