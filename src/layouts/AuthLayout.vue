<template>
  <main class="grid min-h-screen bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
    <section class="relative hidden overflow-hidden lg:block">
      <img
        class="h-full w-full object-cover opacity-70"
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80"
        alt="Students collaborating"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
      <div class="absolute bottom-12 left-12 max-w-xl text-white">
        <h1 class="text-5xl font-semibold tracking-normal">LearnSphere LMS</h1>
        <p class="mt-5 text-lg text-slate-200">
          Enterprise learning operations for admins, instructors, and students in one responsive Vue workspace.
        </p>
      </div>
    </section>

    <section class="flex items-center justify-center px-5 py-10">
      <RouterView />
    </section>
  </main>
</template>
