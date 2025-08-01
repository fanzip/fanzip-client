<template>
  <div class="w-full min-h-screen bg-white text-center flex flex-col items-center">
    <AppHeader type="back "/>

    <!-- 아이콘 영역 -->
    <div class="mt-64 w-20 h-20">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-full h-full">
        <circle cx="12" cy="12" r="12" fill="#FFD633" />
        <path d="M12 7v5" stroke="white" stroke-width="2" stroke-linecap="round" />
        <circle cx="12" cy="15.5" r="1" fill="white" />
      </svg>
    </div>

    <!-- 실패 메시지 -->
    <p class="mt-[3.75rem] text-xl text-black font-normal">
      결제 처리 중 문제가 발생했습니다.
    </p>

    <!-- 버튼 영역 -->
    <div class="mt-[20.5625rem] px-5 w-full max-w-[22rem] flex gap-3 justify-center flex-wrap">
      <BaseButton variant="primary" size="md" @click="retryPayment" class="flex-1 min-w-[9rem]">
        다시 결제
      </BaseButton>
      <BaseButton variant="cancel" size="md" @click="goToHome" class="flex-1 min-w-[9rem]">
        홈으로
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

export default {
  name: 'PaymentFail',
  components: {
    BaseButton,
    AppHeader
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const errorInfo = ref(null)

    const retryPayment = () => {
      router.push('/payments/request')
    }

    const goToHome = () => {
      router.push('/')
    }
    const goBack = () => {
        router.back()
    }

    onMounted(() => {
      const { code, message } = route.query

      if (code || message) {
        errorInfo.value = {
          code: code || '',
          message: message || '알 수 없는 오류가 발생했습니다.'
        }
      } else {
        errorInfo.value = {
          message: '결제가 취소되었거나 오류가 발생했습니다.'
        }
      }
    })

    return {
      errorInfo,
      retryPayment,
      goToHome,
      goBack,
    }
  }
}
</script>