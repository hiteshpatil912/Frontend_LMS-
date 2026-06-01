<template>
  <div class="min-h-screen bg-slate-50 text-slate-950">
    <header class="border-b border-slate-200 bg-white">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <RouterLink to="/" class="text-lg font-semibold text-brand-700">
          Vue LMS
        </RouterLink>

        <div class="flex items-center gap-4 text-sm font-medium text-slate-600">
          <RouterLink to="/courses" class="hover:text-brand-700">
            Courses
          </RouterLink>
          <RouterLink to="/login" class="hover:text-brand-700">
            Login
          </RouterLink>
          <RouterLink
            to="/register"
            class="rounded-md bg-brand-600 px-3 py-2 text-white hover:bg-brand-700"
          >
            Register
          </RouterLink>
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
        <p>&copy; 2026 Vue LMS. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
