<template>
  <section class="w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-slate-950">Login</h1>
      <p class="mt-2 text-sm text-slate-500">Sign in to continue learning.</p>
    </div>

    <div
      v-if="generalError"
      class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ generalError }}
    </div>

    <form class="space-y-4" @submit.prevent="submit">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Email</span>
        <input
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-ring"
          :class="{ 'border-red-300': fieldError('email') }"
        />
        <span v-if="fieldError('email')" class="mt-1 block text-sm text-red-600">
          {{ fieldError('email') }}
        </span>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Password</span>
        <input
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-ring"
          :class="{ 'border-red-300': fieldError('password') }"
        />
        <span v-if="fieldError('password')" class="mt-1 block text-sm text-red-600">
          {{ fieldError('password') }}
        </span>
      </label>

      <button
        type="submit"
        class="w-full rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="loading"
      >
        {{ loading ? 'Signing in...' : 'Login' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { login, loading, errors } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const generalError = computed(() => {
  const value = errors.value.general
  return Array.isArray(value) ? value[0] : value
})

const fieldError = (field) => {
  const value = errors.value[field]
  return Array.isArray(value) ? value[0] : value
}

const submit = async () => {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null

  try {
    await login({ ...form }, redirect)
  } catch {
    // Validation errors are exposed by the auth store and rendered above.
  }
}
</script>
