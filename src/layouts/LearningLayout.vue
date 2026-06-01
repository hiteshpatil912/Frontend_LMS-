<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <header class="border-b border-white/10 bg-slate-950">
      <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouterLink to="/student/my-courses" class="text-sm font-medium text-slate-300 hover:text-white">
          Back to My Courses
        </RouterLink>
        <p class="text-sm font-semibold">
          Learning Mode
        </p>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
