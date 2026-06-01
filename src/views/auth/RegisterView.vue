<template>
  <AuthShell>
    <h2 class="text-2xl font-semibold text-slate-950">Create account</h2>
    <p class="mt-2 text-sm text-slate-500">Join the LMS with the correct workspace role.</p>

    <AuthAlert class="mt-5" :message="generalError" />

    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Full name</span>
        <input v-model.trim="form.name" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="text" autocomplete="name" />
        <p v-if="validation.name" class="mt-1 text-sm text-rose-600">{{ validation.name }}</p>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Email</span>
        <input v-model.trim="form.email" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="email" autocomplete="email" />
        <p v-if="validation.email" class="mt-1 text-sm text-rose-600">{{ validation.email }}</p>
      </label>

      <Listbox v-model="form.role">
        <div class="relative">
          <ListboxLabel class="text-sm font-medium text-slate-700">Role</ListboxLabel>
          <ListboxButton class="focus-ring mt-1 flex w-full items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-left capitalize text-slate-700">
            {{ form.role }}
            <ChevronUpDownIcon class="size-5 text-slate-400" />
          </ListboxButton>
          <ListboxOptions class="absolute z-20 mt-2 w-full rounded-lg border border-slate-200 bg-white p-1 shadow-soft">
            <ListboxOption v-for="role in roles" :key="role" v-slot="{ active, selected }" :value="role">
              <li class="cursor-pointer rounded-md px-3 py-2 text-sm capitalize" :class="[active ? 'bg-slate-100' : '', selected ? 'font-semibold text-brand-700' : 'text-slate-700']">
                {{ role }}
              </li>
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>

      <PasswordField v-model="form.password" label="Password" autocomplete="new-password" :error="validation.password" />
      <PasswordField v-model="form.password_confirmation" label="Confirm password" autocomplete="new-password" :error="validation.password_confirmation" />

      <button class="focus-ring flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="auth.loading">
        <ArrowPathIcon v-if="auth.loading" class="mr-2 size-4 animate-spin" />
        {{ auth.loading ? 'Creating account...' : 'Create account' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      Already registered?
      <RouterLink class="font-semibold text-brand-700 hover:text-brand-600" to="/login">Sign in</RouterLink>
    </p>
  </AuthShell>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ArrowPathIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import AuthAlert from '@/components/auth/AuthAlert.vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import { useAuthStore } from '@/stores/auth/authStore'

const auth = useAuthStore()
const roles = ['student', 'teacher', 'admin']
const form = reactive({
  name: '',
  email: '',
  role: 'student',
  password: '',
  password_confirmation: ''
})
const validation = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const generalError = computed(() => auth.errors.general || '')

const validate = () => {
  validation.name = form.name.length >= 2 ? '' : 'Enter your full name.'
  validation.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  validation.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
  validation.password_confirmation = form.password === form.password_confirmation ? '' : 'Passwords do not match.'
  return !validation.name && !validation.email && !validation.password && !validation.password_confirmation
}

const submit = async () => {
  auth.clearErrors()
  if (!validate()) return
  try {
    await auth.register(form)
  } catch {
    // Store errors are rendered above.
  }
}
</script>
