<template>
  <div class="min-h-screen bg-subtle-bg text-text-base font-sans">
    <header class="sticky top-0 z-10 bg-base-bg/90 backdrop-blur border-b border-nav-stroke">
      <div class="max-w-3xl mx-auto px-5 py-3">
        <h1 class="text-lg font-bold">심사 완료</h1>
      </div>
    </header>

    <main class="min-h-[calc(100vh-64px)] flex items-center justify-center px-5">
      <div
        class="bg-base-bg rounded-2xl shadow-sm border border-subtle-border p-8 text-center space-y-4 max-w-3xl w-full"
      >
        <div class="text-2xl font-bold">승인이 완료되었습니다 🎉</div>
        <p class="text-sm text-subtle-text">
          이제 인플루언서 계정을 설정하고 <br /> 팬들과 소통을 시작해보세요.
        </p>
        <div class="flex flex-row gap-2 justify-center">
          <!-- 메인 버튼 -->
          <router-link
            to="/"
            class="btn btn-primary h-9 w-40 text-sm font-medium inline-flex items-center justify-center whitespace-nowrap"
          >
            메인으로 이동
          </router-link>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// 별도 로직 없음
</script>
