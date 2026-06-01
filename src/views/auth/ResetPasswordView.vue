<template>
  <AuthShell>
    <h2 class="text-2xl font-semibold text-slate-950">Reset password</h2>
    <p class="mt-2 text-sm text-slate-500">Choose a new password for your LMS account.</p>

    <AuthAlert class="mt-5" :message="message" :tone="messageTone" />

    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <input v-model="form.token" type="hidden" />
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Email</span>
        <input v-model.trim="form.email" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="email" autocomplete="email" />
        <p v-if="validation.email" class="mt-1 text-sm text-rose-600">{{ validation.email }}</p>
      </label>

      <PasswordField v-model="form.password" label="New password" autocomplete="new-password" :error="validation.password" />
      <PasswordField v-model="form.password_confirmation" label="Confirm password" autocomplete="new-password" :error="validation.password_confirmation" />

      <button class="focus-ring flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="auth.loading">
        <ArrowPathIcon v-if="auth.loading" class="mr-2 size-4 animate-spin" />
        {{ auth.loading ? 'Resetting...' : 'Reset password' }}
      </button>
    </form>

    <RouterLink class="mt-6 block text-center text-sm font-semibold text-brand-700 hover:text-brand-600" to="/login">Back to sign in</RouterLink>
  </AuthShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import AuthAlert from '@/components/auth/AuthAlert.vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import { useAuthStore } from '@/stores/auth/authStore'

const auth = useAuthStore()
const route = useRoute()
const form = reactive({
  email: route.query.email || '',
  token: route.query.token || '',
  password: '',
  password_confirmation: ''
})
const validation = reactive({
  email: '',
  password: '',
  password_confirmation: ''
})
const message = ref('')
const messageTone = ref('success')

const validate = () => {
  validation.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  validation.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
  validation.password_confirmation = form.password === form.password_confirmation ? '' : 'Passwords do not match.'
  return !validation.email && !validation.password && !validation.password_confirmation
}

const submit = async () => {
  auth.clearErrors()
  message.value = ''
  if (!validate()) return
  try {
    await auth.resetPassword(form)
    messageTone.value = 'success'
    message.value = 'Your password has been reset. You can sign in now.'
  } catch {
    messageTone.value = 'error'
    message.value = auth.errors.general
  }
}
</script>
