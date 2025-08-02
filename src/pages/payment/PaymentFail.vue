<template>
  <div class="w-full min-h-screen base-bg text-center flex flex-col items-center">

  <div class="mt-64 w-20 h-20">
      <img :src="ErrorSymbol" alt="에러" />
  </div>

    <!-- 실패 메시지 -->
    <p class="mt-14 text-xl text-base font-normal">
      예기치 못한 에러가 발생했습니다
    </p>

     <div class="mt-80 absolute bottom-14" >
      <BaseButton variant="primary" size="lg" @click="goToHome">
        돌아가기
      </BaseButton>
      </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ErrorSymbol from '@/assets/icons/ErrorSymbol.svg'

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
      ErrorSymbol,
    }
  }
}
</script>