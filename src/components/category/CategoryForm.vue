<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Category name</span>
        <input v-model.trim="form.name" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.name" class="mt-1 text-sm text-rose-600">{{ validation.name }}</p>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Slug</span>
        <input v-model.trim="form.slug" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.slug" class="mt-1 text-sm text-rose-600">{{ validation.slug }}</p>
      </label>

      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Description</span>
        <textarea v-model.trim="form.description" class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        <p v-if="validation.description" class="mt-1 text-sm text-rose-600">{{ validation.description }}</p>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Parent category</span>
        <select v-model="form.parentId" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option :value="null">Root category</option>
          <option v-for="category in parentOptions" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Status</span>
        <select v-model="form.status" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Thumbnail URL</span>
        <input v-model.trim="form.thumbnail" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="url" />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Icon label</span>
        <input v-model.trim="form.icon" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
      </label>

      <div class="lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Preview</span>
        <div class="mt-2 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <img class="size-16 rounded-lg object-cover" :src="form.thumbnail || fallbackImage" alt="Category preview" />
          <div>
            <p class="font-semibold text-slate-950">{{ form.name || 'Category name' }}</p>
            <p class="mt-1 text-sm text-slate-500">/{{ form.slug || 'category-slug' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <RouterLink class="focus-ring inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to="/admin/categories">
        Cancel
      </RouterLink>
      <button class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="saving">
        <ArrowPathIcon v-if="saving" class="mr-2 size-4 animate-spin" />
        {{ saving ? 'Saving...' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({})
  },
  parentOptions: {
    type: Array,
    default: () => []
  },
  saving: {
    type: Boolean,
    default: false
  },
  submitLabel: {
    type: String,
    default: 'Save category'
  }
})

const emit = defineEmits(['submit'])
const fallbackImage = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80'

const form = reactive({
  name: '',
  slug: '',
  description: '',
  parentId: null,
  thumbnail: '',
  icon: '',
  status: 'active',
  courses: 0
})

const validation = reactive({
  name: '',
  slug: '',
  description: ''
})

watch(
  () => props.initialValue,
  (value) => Object.assign(form, { ...value, parentId: value.parentId || null }),
  { immediate: true, deep: true }
)

watch(
  () => form.name,
  (name) => {
    if (!form.slug) {
      form.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
  }
)

const validate = () => {
  validation.name = form.name ? '' : 'Category name is required.'
  validation.slug = form.slug ? '' : 'Category slug is required.'
  validation.description = form.description ? '' : 'Description is required.'
  return Object.values(validation).every((message) => !message)
}

const submit = () => {
  if (!validate()) return
  emit('submit', { ...form, thumbnail: form.thumbnail || fallbackImage })
}
</script>
