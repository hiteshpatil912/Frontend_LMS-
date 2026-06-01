<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Course details</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ store.currentCourse?.title || 'Course' }}</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Review course metadata, publishing status, and management actions.</p>
      </div>
      <div v-if="store.currentCourse" class="flex flex-wrap gap-2">
        <RouterLink class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" :to="`${basePath}/${store.currentCourse.id}/lessons`">
          Manage lessons
        </RouterLink>
        <PublishToggle :status="store.currentCourse.status" :loading="store.publishing" @toggle="togglePublish" />
        <RouterLink class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" :to="`${basePath}/${store.currentCourse.id}/edit`">
          Edit course
        </RouterLink>
        <button class="focus-ring rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700" type="button" @click="deleteOpen = true">
          Delete
        </button>
      </div>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message || store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'">
          {{ alert.message || store.errors.general }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <div v-if="store.loading" class="h-96 animate-pulse rounded-lg bg-slate-200"></div>
    <CourseInfoCard v-else-if="store.currentCourse" :course="store.currentCourse" />
    <div v-else class="rounded-lg border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
      <h3 class="text-sm font-semibold text-slate-950">Course not found</h3>
      <p class="mt-1 text-sm text-slate-500">This course may have been removed or is unavailable.</p>
      <RouterLink class="focus-ring mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="basePath">
        Back to courses
      </RouterLink>
    </div>

    <DeleteCourseDialog :open="deleteOpen" :course="store.currentCourse" :deleting="store.deleting" @close="deleteOpen = false" @confirm="deleteCourse" />
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import CourseInfoCard from '@/components/course/CourseInfoCard.vue'
import DeleteCourseDialog from '@/components/course/DeleteCourseDialog.vue'
import PublishToggle from '@/components/course/PublishToggle.vue'

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const deleteOpen = ref(false)
const alert = reactive({
  message: '',
  tone: 'success'
})

onMounted(() => {
  props.store.fetchSingleCourse(route.params.id)
})

const togglePublish = async (status) => {
  alert.message = ''
  try {
    await props.store.publishCourse(route.params.id, status)
    alert.tone = 'success'
    alert.message = status === 'published' ? 'Course published successfully.' : 'Course moved to draft.'
  } catch {
    alert.tone = 'error'
    alert.message = props.store.errors.general || 'Unable to update publish status.'
  }
}

const deleteCourse = async () => {
  alert.message = ''
  try {
    await props.store.deleteCourse(route.params.id)
    deleteOpen.value = false
    router.push(props.basePath)
  } catch {
    alert.tone = 'error'
    alert.message = props.store.errors.general || 'Unable to delete course.'
  }
}
</script>
