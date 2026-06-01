<template>
  <div class="flex min-h-screen bg-slate-950 text-white">
    <section class="hidden flex-1 flex-col justify-between bg-brand-700 p-10 lg:flex">
      <RouterLink to="/" class="text-xl font-semibold">
        Vue LMS
      </RouterLink>
      <div class="max-w-md">
        <p class="text-3xl font-semibold leading-tight">
          Learn, practice, complete, and certify from one focused LMS.
        </p>
      </div>
    </section>

    <main class="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10 text-slate-950">
      <RouterView />
    </main>
  </div>
</template>
