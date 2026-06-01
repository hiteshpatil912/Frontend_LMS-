<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-slate-950">Courses</h1>
        <p class="mt-2 text-sm text-slate-500">Starter public course catalog.</p>
      </div>

      <input
        type="search"
        placeholder="Search courses"
        class="w-full rounded-md border border-slate-300 px-3 py-2 focus-ring sm:w-72"
      />
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="course in courses" :key="course.slug" class="rounded-lg border border-slate-200 bg-white p-5">
        <h2 class="font-semibold">{{ course.title }}</h2>
        <p class="mt-2 text-sm text-slate-500">{{ course.description }}</p>
        <RouterLink :to="`/courses/${course.slug}`" class="mt-4 inline-block text-sm font-medium text-brand-700">
          View Details
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup>
const courses = [
  { slug: 'vue-foundations', title: 'Vue Foundations', description: 'Starter catalog item.' },
  { slug: 'laravel-api-lms', title: 'Laravel API LMS', description: 'Starter catalog item.' },
  { slug: 'pinia-state-management', title: 'Pinia State Management', description: 'Starter catalog item.' }
]
</script>
