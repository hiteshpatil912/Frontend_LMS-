<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Student workspace</p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-950">Wishlist</h1>
        <p class="mt-1 text-sm text-slate-500">Courses you saved for later.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="wishlist.loading"
        @click="loadWishlist"
      >
        Refresh
      </button>
    </div>

    <div v-if="wishlist.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ wishlist.error.message }}
    </div>

    <div v-if="wishlist.loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in 6" :key="item" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="h-40 animate-pulse bg-slate-200"></div>
        <div class="space-y-3 p-5">
          <div class="h-5 w-3/4 animate-pulse rounded bg-slate-200"></div>
          <div class="h-4 w-1/2 animate-pulse rounded bg-slate-100"></div>
        </div>
      </article>
    </div>

    <div v-else-if="wishlist.hasWishlist" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in wishlist.wishlists"
        :key="item.id"
        class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        <div class="h-40 bg-slate-200">
          <img
            v-if="item.thumbnail"
            :src="item.thumbnail"
            :alt="item.title"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-brand-600 to-slate-900 text-sm font-semibold text-white">
            {{ initials(item.title) }}
          </div>
        </div>

        <div class="p-5">
          <p class="text-sm font-medium text-brand-700">Saved Course</p>
          <h2 class="mt-1 text-lg font-semibold text-slate-950">{{ item.title }}</h2>
          <p class="mt-2 text-sm text-slate-500">
            Added {{ formatDate(item.addedDate) }}
          </p>
        </div>
      </article>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      Wishlist courses will appear here.
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLmsWishlistStore } from '@/stores/lms/wishlistStore'

const wishlist = useLmsWishlistStore()

const loadWishlist = async () => {
  try {
    await wishlist.fetchWishlist()
  } catch {
    // Store owns the rendered error state.
  }
}

const formatDate = (value) => {
  if (!value) return 'recently'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

const initials = (title) =>
  String(title || 'Course')
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

onMounted(loadWishlist)
</script>
