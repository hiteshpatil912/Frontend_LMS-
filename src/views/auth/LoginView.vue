<template>
  <AuthShell>
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold text-slate-950">Sign in</h2>
        <p class="mt-2 text-sm text-slate-500">Access your LMS workspace securely.</p>
      </div>
      <Menu as="div" class="relative">
        <MenuButton class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Demo
        </MenuButton>
        <TransitionRoot
          enter="transition duration-100 ease-out"
          enter-from="scale-95 opacity-0"
          enter-to="scale-100 opacity-100"
          leave="transition duration-75 ease-in"
          leave-from="scale-100 opacity-100"
          leave-to="scale-95 opacity-0"
        >
          <MenuItems class="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-soft focus:outline-none">
            <MenuItem v-for="role in roles" :key="role" v-slot="{ active }">
              <button class="w-full rounded-md px-3 py-2 text-left text-sm capitalize" :class="active ? 'bg-slate-100' : ''" @click="auth.bootstrapDemo(role)">
                {{ role }}
              </button>
            </MenuItem>
          </MenuItems>
        </TransitionRoot>
      </Menu>
    </div>

    <AuthAlert class="mt-5" :message="generalError" />

    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Email</span>
        <input v-model.trim="form.email" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="email" autocomplete="email" />
        <p v-if="validation.email" class="mt-1 text-sm text-rose-600">{{ validation.email }}</p>
      </label>

      <PasswordField v-model="form.password" :error="validation.password" />

      <div class="flex items-center justify-between gap-3">
        <label class="flex items-center gap-2 text-sm text-slate-600">
          <input v-model="form.remember" class="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" type="checkbox" />
          Remember me
        </label>
        <RouterLink class="text-sm font-medium text-brand-700 hover:text-brand-600" to="/forgot-password">Forgot password?</RouterLink>
      </div>

      <button class="focus-ring flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="auth.loading">
        <ArrowPathIcon v-if="auth.loading" class="mr-2 size-4 animate-spin" />
        {{ auth.loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      New to LearnSphere?
      <RouterLink class="font-semibold text-brand-700 hover:text-brand-600" to="/register">Create an account</RouterLink>
    </p>
  </AuthShell>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems, TransitionRoot } from '@headlessui/vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import AuthAlert from '@/components/auth/AuthAlert.vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import { useAuthStore } from '@/stores/auth/authStore'

const auth = useAuthStore()
const route = useRoute()
const roles = ['admin', 'teacher', 'student']
const form = reactive({
  email: '',
  password: '',
  remember: true
})
const validation = reactive({
  email: '',
  password: ''
})

const generalError = computed(() => auth.errors.general || '')

const validate = () => {
  validation.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.'
  validation.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
  return !validation.email && !validation.password
}

const submit = async () => {
  auth.clearErrors()
  if (!validate()) return
  try {
    await auth.login(form, route.query.redirect || null)
  } catch {
    // Store errors are rendered above.
  }
}
</script>
