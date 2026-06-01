<template>
  <main class="grid min-h-screen bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
    <section class="relative hidden overflow-hidden lg:block">
      <img class="h-full w-full object-cover opacity-70" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80" alt="Students collaborating" />
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-transparent"></div>
      <div class="absolute inset-x-12 bottom-12 max-w-2xl text-white">
        <p class="text-sm font-semibold uppercase tracking-wider text-sky-200">Enterprise LMS</p>
        <h1 class="mt-3 text-5xl font-semibold tracking-normal">LearnSphere LMS</h1>
        <p class="mt-5 text-lg leading-8 text-slate-200">Secure learning operations for admins, instructors, and students in one responsive Vue workspace.</p>
      </div>
    </section>

    <section class="flex items-center justify-center px-5 py-10 sm:px-8">
      <TransitionRoot appear :show="true" as="template">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="translate-y-3 opacity-0"
          enter-to="translate-y-0 opacity-100"
          leave="duration-150 ease-in"
          leave-from="translate-y-0 opacity-100"
          leave-to="translate-y-3 opacity-0"
        >
          <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-soft sm:p-8">
            <slot />
          </div>
        </TransitionChild>
      </TransitionRoot>
    </section>
  </main>
</template>

<script setup>
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
</script>
