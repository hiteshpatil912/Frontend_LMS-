<template>
  <section class="w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-slate-950">Register</h1>
      <p class="mt-2 text-sm text-slate-500">Starter account creation screen.</p>
    </div>

    <form class="space-y-4">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Name</span>
        <input type="text" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-ring" />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Email</span>
        <input type="email" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-ring" />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-slate-700">Password</span>
        <input type="password" class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus-ring" />
      </label>

      <button type="button" class="w-full rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">
        Create Account
      </button>
    </form>
  </section>
</template>
