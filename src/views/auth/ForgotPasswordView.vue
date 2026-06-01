<template>
  <AuthShell>
    <h2 class="text-2xl font-semibold text-slate-950">Forgot password</h2>
    <p class="mt-2 text-sm text-slate-500">Enter your email and we will send reset instructions.</p>

    <AuthAlert class="mt-5" :message="message" :tone="messageTone" />

    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Email</span>
        <input v-model.trim="form.email" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="email" autocomplete="email" />
        <p v-if="validation.email" class="mt-1 text-sm text-rose-600">{{ validation.email }}</p>
      </label>

      <button class="focus-ring flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="auth.loading">
        <ArrowPathIcon v-if="auth.loading" class="mr-2 size-4 animate-spin" />
        {{ auth.loading ? 'Sending...' : 'Send reset link' }}
      </button>
    </form>

    <RouterLink class="mt-6 block text-center text-sm font-semibold text-brand-700 hover:text-brand-600" to="/login">Back to sign in</RouterLink>
  </AuthShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import AuthAlert from '@/components/auth/AuthAlert.vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import { useAuthStore } from '@/stores/auth/authStore'

const auth = useAuthStore()
const form = reactive({ email: '' })
const validation = reactive({ email: '' })
const message = ref('')
const messageTone = ref('success')

const validate = () => {
  validation.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  return !validation.email
}

const submit = async () => {
  auth.clearErrors()
  message.value = ''
  if (!validate()) return
  try {
    await auth.forgotPassword(form)
    messageTone.value = 'success'
    message.value = 'Reset instructions have been sent if this email exists.'
  } catch {
    messageTone.value = 'error'
    message.value = auth.errors.general
  }
}
</script>
