<template>
  <section
    class="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm"
  >
    <EmptyChatState v-if="!chat" class="m-4 flex-1" />

    <template v-else>
      <!-- Header -->
      <header
        class="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white p-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="grid size-10 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white"
          >
            {{ chat.avatar }}
          </div>

          <div>
            <h2 class="text-base font-semibold text-slate-950">
              {{ chat.name }}
            </h2>

            <div class="mt-1 flex items-center gap-2">
              <OnlineStatusBadge :online="chat.online" />
              <TypingIndicator :show="chat?.typing" />
            </div>
          </div>
        </div>

        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          @click="emit('refresh')"
        >
          Refresh
        </button>
      </header>

      <!-- Messages -->
      <div ref="messagesContainer" class="min-h-0 flex-1 overflow-y-auto p-4">
        <div v-if="loading" class="space-y-3">
          <div
            v-for="item in 5"
            :key="item"
            class="h-16 animate-pulse rounded-lg bg-slate-200"
          ></div>
        </div>

        <template v-else>
          <div class="space-y-3">
            <MessageBubble
              v-for="message in messages"
              :key="message.id"
              :message="message"
            />
          </div>
        </template>
      </div>

      <!-- Input -->
      <div class="shrink-0 border-t border-slate-200 bg-white">
        <ChatInput
          :loading="sending"
          :receiver-id="Number(chat?.otherId)"
          :role="role"
          @send="$emit('send', $event)"
        />
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";

import ChatInput from "@/components/chat/ChatInput.vue";
import EmptyChatState from "@/components/chat/EmptyChatState.vue";
import MessageBubble from "@/components/chat/MessageBubble.vue";
import OnlineStatusBadge from "@/components/chat/OnlineStatusBadge.vue";
import TypingIndicator from "@/components/chat/TypingIndicator.vue";



const props = defineProps({
  chat: {
    type: Object,
    default: null,
  },

  messages: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },

  sending: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    required: true,
  },
});


const emit = defineEmits(["send", "refresh"]);

const messagesContainer = ref(null);

const scrollToBottom = async () => {
  await nextTick();

  if (!messagesContainer.value) return;

  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior: "smooth",
  });
};

// New message
watch(
  () => props.messages.length,
  () => {
    scrollToBottom();
  }
);

// Chat change
watch(
  () => props.chat?.id,
  () => {
    scrollToBottom();
  },
  {
    immediate: true,
  }
);
</script>
