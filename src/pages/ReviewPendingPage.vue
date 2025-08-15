<template>
  <div class="min-h-screen bg-subtle-bg flex flex-col items-center justify-center p-6">
    <div
      class="bg-base-bg rounded-2xl shadow-sm border border-subtle-border p-8 max-w-md text-center space-y-4"
    >
      <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
        <svg
          class="w-6 h-6 text-yellow-500"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 class="text-xl font-bold">심사 진행중</h1>
      <p class="text-sm text-subtle-text">
        제출하신 정보가 운영팀에서 확인 중이에요.<br />
        보통 영업일 기준 1~3일 내 결과를 안내드립니다.
      </p>
      <div class="flex flex-col sm:flex-row gap-2 justify-center pt-2">
        <!-- 회색 버튼 -->
        <router-link
          to="/"
          class="btn h-10 px-5 inline-flex items-center justify-center w-auto flex-none bg-subtle-bg text-text-base border-subtle-border hover:bg-subtle-border"
        >
          홈으로
        </router-link>

        <router-link
          to="/support/chat?topic=review"
          class="btn btn-primary h-10 px-5 inline-flex items-center justify-center w-auto flex-none"
        >
          문의하기
        </router-link>
      </div>
    </div>
  </div>
</template>
