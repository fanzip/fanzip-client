<template>
  <div class="min-h-screen bg-subtle-bg text-text-base font-sans">
    <header class="sticky top-0 z-10 bg-base-bg/90 backdrop-blur border-b border-nav-stroke">
      <div class="max-w-3xl mx-auto px-5 py-3">
        <h1 class="text-lg font-bold">심사 완료</h1>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-5 py-10">
      <div
        class="bg-base-bg rounded-2xl shadow-sm border border-subtle-border p-8 text-center space-y-4"
      >
        <div class="text-2xl font-bold">승인이 완료되었습니다 🎉</div>
        <p class="text-sm text-subtle-text">
          이제 인플루언서 계정을 설정하고 팬들과 소통을 시작해보세요.
        </p>
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <router-link
            to="/dashboard"
            class="btn btn-primary h-10 px-5 w-auto flex-none inline-flex items-center justify-center text-md font-medium"
          >
            메인으로 이동
          </router-link>
          <router-link
            to="/profile"
            class="btn h-10 px-5 inline-flex items-center justify-center text-md font-medium"
          >
            마이페이지으로 이동
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// 별도 로직 없음
</script>
