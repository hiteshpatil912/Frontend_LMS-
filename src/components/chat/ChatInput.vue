<template>
  <form class="border-t border-slate-200 bg-white p-4" @submit.prevent="submit">
    <div class="flex items-end gap-2">
      <Menu as="div" class="relative">
        <MenuButton
          class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
          type="button"
          >☺</MenuButton
        >
        <MenuItems
          class="absolute bottom-12 left-0 z-20 grid grid-cols-4 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
        >
          <MenuItem v-for="emoji in emojis" :key="emoji" v-slot="{ active }">
            <button
              class="rounded p-2 text-lg"
              :class="active ? 'bg-slate-100' : ''"
              type="button"
              @click="body += emoji"
            >
              {{ emoji }}
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <label
        class="focus-ring rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
      >
        <PaperClipIcon class="size-5" />
        <input
          class="sr-only"
          type="file"
          @change="attachmentName = $event.target.files?.[0]?.name || ''"
        />
      </label>
      <textarea
        @keydown.enter.exact.prevent="submit"
        v-model.trim="body"
        class="focus-ring min-h-11 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Write a message"
      ></textarea>
      <button
        class="focus-ring rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        :disabled="loading || !body"
      >
        Send
      </button>
    </div>
    <p v-if="attachmentName" class="mt-2 text-xs text-slate-500">
      Attached: {{ attachmentName }}
    </p>
  </form>
</template>

<script setup>
import api from "@/plugins/axios";
import { ref, watch } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { PaperClipIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: true,
  },

  receiverId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["send"]);

const emojis = ["👍", "👏", "🙂", "🔥", "✅", "💡", "🙏", "🎯"];

const body = ref("");
const attachmentName = ref("");

let typingTimeout = null;
let isTyping = false;

watch(body, async (value) => {
  if (!props.receiverId) return;

  if (value.trim() && !isTyping) {
    isTyping = true;

    try {
      await api.post(`/${props.role}/chat/typing-started`, {
        receiver_id: props.receiverId,
      });
    } catch (e) {
      console.log(e);
    }
  }

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(async () => {
    if (isTyping) {
      isTyping = false;

      try {
        await api.post(`/${props.role}/chat/typing-stopped`, {
          receiver_id: props.receiverId,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, 1500);
});

const submit = async () => {
  if (!body.value.trim()) return;
  if (isTyping) {
    isTyping = false;

    clearTimeout(typingTimeout);

    try {
      await api.post(`/${props.role}/chat/typing-stopped`, {
        receiver_id: props.receiverId,
      });
    } catch (e) {}
  }
  emit("send", {
    body: body.value,
  });

  body.value = "";
  attachmentName.value = "";
};
</script>
