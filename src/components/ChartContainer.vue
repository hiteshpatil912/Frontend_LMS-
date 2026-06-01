<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-base font-semibold text-slate-950">{{ title }}</h2>
      <Listbox v-model="selectedRange">
        <div class="relative">
          <ListboxButton class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">{{ selectedRange }}</ListboxButton>
          <ListboxOptions class="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-soft">
            <ListboxOption v-for="range in ranges" :key="range" v-slot="{ active, selected }" :value="range">
              <li class="cursor-pointer rounded-md px-3 py-2 text-sm" :class="[active ? 'bg-slate-100' : '', selected ? 'font-semibold' : '']">{{ range }}</li>
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
    <div class="mt-6 flex h-64 items-end gap-3">
      <div v-for="bar in bars" :key="bar.label" class="flex flex-1 flex-col items-center gap-2">
        <div class="w-full rounded-t bg-brand-500" :style="{ height: `${bar.value}%` }"></div>
        <span class="text-xs text-slate-500">{{ bar.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

defineProps({
  title: String,
  bars: {
    type: Array,
    default: () => []
  }
})

const ranges = ['7 days', '30 days', '90 days']
const selectedRange = ref(ranges[1])
</script>
