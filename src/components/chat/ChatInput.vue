<template>
  <form class="border-t border-slate-200 bg-white p-4" @submit.prevent="submit">
    <div class="flex items-end gap-2">
      <Menu as="div" class="relative">
        <MenuButton class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50" type="button">☺</MenuButton>
        <MenuItems class="absolute bottom-12 left-0 z-20 grid grid-cols-4 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <MenuItem v-for="emoji in emojis" :key="emoji" v-slot="{ active }">
            <button class="rounded p-2 text-lg" :class="active ? 'bg-slate-100' : ''" type="button" @click="body += emoji">{{ emoji }}</button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <label class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50">
        <PaperClipIcon class="size-5" />
        <input class="sr-only" type="file" @change="attachmentName = $event.target.files?.[0]?.name || ''" />
      </label>
      <textarea  @keydown.enter.exact.prevent="submit" v-model.trim="body" class="focus-ring min-h-11 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Write a message"></textarea>
      <button class="focus-ring rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="loading || !body">
        Send
      </button>
    </div>
    <p v-if="attachmentName" class="mt-2 text-xs text-slate-500">Attached: {{ attachmentName }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { PaperClipIcon } from "@heroicons/vue/24/outline";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["send"]);

const emojis = ["👍", "👏", "🙂", "🔥", "✅", "💡", "🙏", "🎯"];

const body = ref("");
const attachmentName = ref("");

const submit = () => {
  if (!body.value.trim()) return;

  emit("send", {
    body: body.value,
  });

  body.value = "";
  attachmentName.value = "";
};
</script>
