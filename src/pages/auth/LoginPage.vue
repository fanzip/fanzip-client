<script setup>
import { getKakaoLoginUrl } from '@/api/authApi'

const redirectToKakao = async () => {
  try {
    const url = await getKakaoLoginUrl()
    window.location.href = url
  } catch (e) {
    console.error('카카오 로그인 URL 요청 실패:', e)
  }
}
</script>

<template>
  <div class="flex flex-col items-center mt-[230px]">
    <img src="@/assets/common/Logo.svg" />

    <button
      @click="redirectToKakao"
      class="kakao-button btn relative w-[265px] h-[36px] bg-[#FEE500] mt-7"
    >
      <img
        src="@/assets/icons/KakaoSymbol.svg"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
        alt="naver"
      />
      <span class="block text-center text-black w-full">카카오 로그인</span>
    </button>

    <button class="kakao-button btn relative w-[265px] h-[36px] bg-[#03C75A] mt-4">
      <img
        src="@/assets/icons/NaverSymbol.svg"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8"
        alt="naver"
      />
      <span class="block text-center text-white w-full">네이버 로그인</span>
    </button>
  </div>
</template>
