<template>
  <AppHeader type="back" />

  <!-- 로딩 중 -->
  <div v-if="isLoading" class="flex flex-col items-center justify-center h-screen text-lg font-semibold">
    결제 승인 처리 중...
  </div>

  <!-- 결제 성공 -->
  <div v-else-if="paymentData" class="flex flex-col items-center bg-white w-full h-screen">
    <!-- 아이콘 -->
    <div class="mt-64 w-20 h-20">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2" viewBox="0 0 22 22" class="w-full h-full">
        <circle cx="12" cy="12" r="11" fill="#FFD633" />
        <path d="M7 12l3 3 7-7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- 완료 메시지 -->
    <p class="mt-[3.75rem] text-xl text-black font-normal">결제가 완료되었습니다!</p>

    <!-- 버튼 -->
    <div class="mt-[20.5625rem] px-5 w-full">
      <BaseButton variant="primary" size="lg" @click="goToHome" class="w-full max-w-[22rem] mx-auto">
        돌아가기
      </BaseButton>
    </div>
  </div>

  <!-- 에러 발생 -->
  <div v-else class="flex flex-col items-center justify-center w-full h-screen bg-white text-center px-4">
    <h1 class="text-[#dc3545] text-lg mt-25 font-semibold">
      {{ error || '결제 처리 중 오류가 발생했습니다' }}
    </h1>
     <div class="mt-10 px-5 w-full">
       <BaseButton variant="primary" size="lg" @click="goToHome" class="w-full max-w-[22rem] mx-auto">
        돌아가기
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  name: 'PaymentSuccess',
  components: {
    AppHeader,
    BaseButton
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const paymentData = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    const goToHome = () => {
      router.push('/')
    }

    const processPaymentSuccess = async () => {
      const params = route.query
      const paymentId = params.paymentId

      if (!params.paymentKey || !params.orderId || !params.amount) {
        error.value = '필수 결제 정보가 누락되었습니다.'
        return
      }

      isLoading.value = true

      try {
        const approveResponse = await fetch(`http://localhost:8080/api/payments/${paymentId}/approve`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentKey: params.paymentKey,
            orderId: params.orderId,
            amount: parseInt(params.amount)
          })
        })

        if (!approveResponse.ok) {
          const errorData = await approveResponse.json()
          throw new Error(errorData.message || '결제 승인 실패')
        }

        const approvedData = await approveResponse.json()
        paymentData.value = {
          orderId: approvedData.orderId,
          amount: approvedData.amount,
          paymentMethod: approvedData.paymentMethod || '토스페이먼트',
          createdAt: approvedData.createdAt || new Date().toISOString()
        }
      } catch (err) {
        error.value = err.message || '결제 승인 중 오류가 발생했습니다.'
        setTimeout(() => {
          router.push(`/payments/fail?message=${encodeURIComponent(err.message)}`)
        }, 3000)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      processPaymentSuccess()
    })

    return {
      paymentData,
      isLoading,
      error,
      goToHome
    }
  }
}
</script>