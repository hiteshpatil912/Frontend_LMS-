<template>
  <div>
    <span class="text-sm font-medium text-slate-700">Video upload</span>
    <div
      class="mt-1 rounded-lg border border-dashed p-5 transition"
      :class="dragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-white'"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="handleDrop"
    >
      <div v-if="preview" class="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
        <video class="h-52 w-full object-contain" :src="preview" controls></video>
      </div>
      <div v-else class="text-center">
        <VideoCameraIcon class="mx-auto size-10 text-slate-400" />
        <p class="mt-3 text-sm font-medium text-slate-700">Drag and drop a lesson video</p>
        <p class="mt-1 text-xs text-slate-500">MP4, WebM, or MOV up to your backend limit.</p>
      </div>

      <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label class="focus-ring inline-flex cursor-pointer justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Choose video
          <input class="sr-only" type="file" accept="video/mp4,video/webm,video/quicktime" @change="handleInput" />
        </label>
        <span v-if="fileName" class="truncate text-sm text-slate-500">{{ fileName }}</span>
      </div>

      <div v-if="uploading || progress" class="mt-4">
        <div class="h-2 overflow-hidden rounded-full bg-slate-100">
          <div class="h-full rounded-full bg-brand-600 transition-all" :style="{ width: `${progress}%` }"></div>
        </div>
        <p class="mt-1 text-xs text-slate-500">{{ uploading ? `Uploading ${progress}%` : 'Video ready' }}</p>
      </div>

      <p v-if="error" class="mt-3 text-sm text-rose-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VideoCameraIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['update:modelValue', 'preview'])
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const dragging = ref(false)
const uploading = ref(false)
const progress = ref(0)
const fileName = ref('')
const preview = ref('')
const error = ref('')

const upload = (file) => {
  error.value = ''
  if (!file) return
  if (!file.type.startsWith('video/')) {
    error.value = 'Upload a valid video file.'
    return
  }

  fileName.value = file.name
  preview.value = URL.createObjectURL(file)
  emit('preview', preview.value)
  uploading.value = true
  progress.value = 12

  const timer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + 22)
    if (progress.value >= 100) {
      window.clearInterval(timer)
      uploading.value = false
      emit('update:modelValue', preview.value)
    }
  }, 160)
}

const handleInput = (event) => upload(event.target.files?.[0])
const handleDrop = (event) => {
  dragging.value = false
  upload(event.dataTransfer.files?.[0])
}
</script>
