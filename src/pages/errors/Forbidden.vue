<template>
  <section class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-soft">
      <p class="text-sm font-semibold text-brand-700">403</p>
      <h1 class="mt-2 text-2xl font-semibold text-slate-950">Access denied</h1>
      <p class="mt-3 text-sm text-slate-500">
        You do not have permission to access this page.
      </p>
      <RouterLink
        to="/student/dashboard"
        class="mt-6 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Go to Dashboard
      </RouterLink>
    </div>
  </section>
</template>
