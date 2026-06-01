<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Title</span>
        <input v-model.trim="form.title" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.title" class="mt-1 text-sm text-rose-600">{{ validation.title }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Slug</span>
        <input v-model.trim="form.slug" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.slug" class="mt-1 text-sm text-rose-600">{{ validation.slug }}</p>
      </label>
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Short description</span>
        <input v-model.trim="form.shortDescription" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.shortDescription" class="mt-1 text-sm text-rose-600">{{ validation.shortDescription }}</p>
      </label>
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Full description</span>
        <textarea v-model.trim="form.fullDescription" class="focus-ring mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        <p v-if="validation.fullDescription" class="mt-1 text-sm text-rose-600">{{ validation.fullDescription }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Category</span>
        <select v-model="form.category" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select category</option>
          <option v-for="category in categoryOptions" :key="category.id || category.name" :value="category.name">{{ category.name }}</option>
        </select>
        <p v-if="validation.category" class="mt-1 text-sm text-rose-600">{{ validation.category }}</p>
      </label>
      <CourseThumbnailUploader v-model="form.thumbnail" />
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Instructor</span>
        <input v-model.trim="form.instructor" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.instructor" class="mt-1 text-sm text-rose-600">{{ validation.instructor }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Price</span>
        <input v-model.number="form.price" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="number" min="0" />
        <p v-if="validation.price" class="mt-1 text-sm text-rose-600">{{ validation.price }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Level</span>
        <select v-model="form.level" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Duration</span>
        <input v-model.trim="form.duration" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.duration" class="mt-1 text-sm text-rose-600">{{ validation.duration }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Status</span>
        <select v-model="form.status" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
    </div>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <RouterLink class="focus-ring inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" :to="cancelTo">
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
import { computed, onMounted, reactive, watch } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import CourseThumbnailUploader from '@/components/course/CourseThumbnailUploader.vue'
import { useAdminCategoryStore } from '@/stores/admin/categoryStore'

const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({})
  },
  saving: {
    type: Boolean,
    default: false
  },
  cancelTo: {
    type: String,
    required: true
  },
  submitLabel: {
    type: String,
    default: 'Create course'
  }
})

const emit = defineEmits(['submit'])
const categoryStore = useAdminCategoryStore()
const fallbackCategories = [
  { id: 'business', name: 'Business' },
  { id: 'design', name: 'Design' },
  { id: 'technology', name: 'Technology' }
]

const categoryOptions = computed(() => (categoryStore.activeCategories.length ? categoryStore.activeCategories : fallbackCategories))

const form = reactive({
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  thumbnail: '',
  instructor: '',
  price: 0,
  level: 'Beginner',
  duration: '',
  status: 'draft'
})

const validation = reactive({
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  category: '',
  instructor: '',
  price: '',
  duration: ''
})

watch(
  () => props.initialValue,
  (value) => Object.assign(form, value),
  { immediate: true, deep: true }
)

watch(
  () => form.title,
  (title) => {
    if (!form.slug) {
      form.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
  }
)

const validate = () => {
  validation.title = form.title ? '' : 'Course title is required.'
  validation.slug = form.slug ? '' : 'Course slug is required.'
  validation.shortDescription = form.shortDescription ? '' : 'Short description is required.'
  validation.fullDescription = form.fullDescription ? '' : 'Full description is required.'
  validation.category = form.category ? '' : 'Category is required.'
  validation.instructor = form.instructor ? '' : 'Instructor is required.'
  validation.price = Number(form.price) >= 0 ? '' : 'Price must be zero or more.'
  validation.duration = form.duration ? '' : 'Duration is required.'
  return Object.values(validation).every((message) => !message)
}

const submit = () => {
  if (!validate()) return
  emit('submit', { ...form })
}

onMounted(() => {
  if (!categoryStore.categories.length) categoryStore.fetchCategories()
})
</script>
