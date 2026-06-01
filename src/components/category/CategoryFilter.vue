<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-950">{{ title }}</h3>
        <p class="mt-1 text-xs text-slate-500">Filter courses by learning category.</p>
      </div>
      <Listbox :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <div class="relative w-full sm:w-64">
          <ListboxButton class="focus-ring flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700">
            <span>{{ selectedLabel }}</span>
            <ChevronUpDownIcon class="size-4 text-slate-400" />
          </ListboxButton>
          <Transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <ListboxOptions class="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg">
              <ListboxOption v-slot="{ active, selected }" value="">
                <div :class="[active ? 'bg-brand-50 text-brand-700' : 'text-slate-700', 'flex cursor-pointer items-center justify-between px-3 py-2']">
                  <span>All categories</span>
                  <CheckIcon v-if="selected" class="size-4" />
                </div>
              </ListboxOption>
              <ListboxOption v-for="category in categories" v-slot="{ active, selected }" :key="category.id" :value="category.name">
                <div :class="[active ? 'bg-brand-50 text-brand-700' : 'text-slate-700', 'flex cursor-pointer items-center justify-between px-3 py-2']">
                  <span>{{ category.name }}</span>
                  <CheckIcon v-if="selected" class="size-4" />
                </div>
              </ListboxOption>
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  categories: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Course categories'
  }
})

defineEmits(['update:modelValue'])

const selectedLabel = computed(() => props.modelValue || 'All categories')
</script>
