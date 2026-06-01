<template>
  <div class="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_180px]">
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Search resources</span>
      <input :value="search" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="search" placeholder="Search title, course, lesson" @input="$emit('update:search', $event.target.value)" />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Course</span>
      <select :value="course" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" @change="$emit('update:course', $event.target.value)">
        <option value="">All courses</option>
        <option v-for="item in courses" :key="item" :value="item">{{ item }}</option>
      </select>
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Visibility</span>
      <select :value="visibility" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" @change="$emit('update:visibility', $event.target.value)">
        <option value="">All</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </label>
  </div>
</template>

<script setup>
defineProps({
  search: {
    type: String,
    default: ''
  },
  course: {
    type: String,
    default: ''
  },
  visibility: {
    type: String,
    default: ''
  },
  courses: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:search', 'update:course', 'update:visibility'])
</script>
