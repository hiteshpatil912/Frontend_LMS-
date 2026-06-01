<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Learning dashboard</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">My Courses</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Track enrolled courses, resume lessons, and discover available courses.</p>
      </div>
      <button class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" type="button" @click="refresh">Refresh</button>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-4 sm:grid-cols-3">
      <LearningStatsCard label="Enrolled" :value="store.enrolledCourses.length" caption="Active learning paths" />
      <LearningStatsCard label="In progress" :value="store.inProgressCourses.length" caption="Courses underway" />
      <LearningStatsCard label="Completed" :value="store.completedCourses.length" caption="Finished courses" />
    </div>

    <div v-if="store.loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="item in 3" :key="item" class="h-80 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <EmptyEnrollmentState v-else-if="!store.enrolledCourses.length" />
    <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <EnrolledCourseCard v-for="course in store.enrolledCourses" :key="course.id" :course="course" :progress="store.progressPercentage(course)" />
    </div>

    <section class="space-y-4">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 class="text-lg font-semibold text-slate-950">Available courses</h3>
      </div>
      <CategoryFilter v-model="selectedCategory" :categories="categoryStore.activeCategories" title="Browse by category" />
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="course in filteredAvailableCourses" :key="course.id" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h4 class="text-base font-semibold text-slate-950">{{ course.title }}</h4>
          <p class="mt-2 text-sm text-slate-500">{{ course.description }}</p>
          <div class="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>{{ course.level }}</span>
            <span>${{ course.price }}</span>
          </div>
          <button class="focus-ring mt-5 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="button" :disabled="store.enrolling" @click="enroll(course.id)">
            {{ store.enrolling ? 'Enrolling...' : 'Enroll' }}
          </button>
        </article>
      </div>
      <div v-if="!filteredAvailableCourses.length" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <p class="text-sm font-medium text-slate-700">No available courses in this category</p>
        <p class="mt-1 text-sm text-slate-500">Choose another category or clear the filter.</p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import CategoryFilter from '@/components/category/CategoryFilter.vue'
import EmptyEnrollmentState from '@/components/student/EmptyEnrollmentState.vue'
import EnrolledCourseCard from '@/components/student/EnrolledCourseCard.vue'
import LearningStatsCard from '@/components/student/LearningStatsCard.vue'
import { useAdminCategoryStore } from '@/stores/admin/categoryStore'
import { useStudentEnrolledCourseStore } from '@/stores/student/enrolledCourseStore'
import { useStudentProgressStore } from '@/stores/student/progressStore'




const store = useStudentEnrolledCourseStore()

onMounted(() => {

store.fetchEnrolledCourses()
})

const progressStore = useStudentProgressStore()
const categoryStore = useAdminCategoryStore()
const selectedCategory = ref('')

const availableCourses = computed(() => store.catalog.filter((course) => !store.isEnrolled(course.id)))
const filteredAvailableCourses = computed(() => {
  if (!selectedCategory.value) return availableCourses.value
  return availableCourses.value.filter((course) => course.category === selectedCategory.value)
})

const refresh = async () => {
  await Promise.all([store.fetchEnrolledCourses(), categoryStore.fetchCategories()])
  progressStore.buildLocalProgress()
}

const enroll = async (courseId) => {
  await store.enrollCourse(courseId)
  progressStore.buildLocalProgress()
}

onMounted(refresh)
</script>
