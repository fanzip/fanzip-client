<template>
  <!-- 로딩 중 -->
  <div
    v-if="isLoading"
    class="flex flex-col items-center justify-center h-screen text-lg font-semibold"
  >
    결제 승인 처리 중...
  </div>

  <!-- 결제 성공 -->
  <div v-else-if="paymentData" class="flex flex-col items-center base-bg w-full h-screen">
    <!-- 아이콘 -->
    <div class="mt-64 w-20 h-20">
      <img :src="CheckSymbol" alt="체크" />
    </div>

    <!-- 완료 메시지 -->
    <p class="mt-14 text-xl text-base font-normal">결제가 완료되었습니다!</p>

    <!-- 버튼 -->
    <div v-if="isFromFanMeeting" class="fixed bottom-14 left-5 right-5 flex flex-col items-center space-y-3">
      <BaseButton variant="primary" size="lg" @click="goToMobileTicket">
        내 카드 보러가기
      </BaseButton>
      <BaseButton variant="cancel" size="lg" @click="goToHome">
        돌아가기
      </BaseButton>
    </div>
    <div v-else class="fixed bottom-14 left-0 right-0 flex justify-center">
      <BaseButton variant="primary" size="lg" @click="goToHome"> 돌아가기 </BaseButton>
    </div>
  </div>

  <!-- 에러 발생 -->
  <div
    v-else
    class="flex flex-col items-center justify-center w-full h-screen base-bg text-center px-4"
  >
    <h1 class="text-emphasis lg mt-25 font-semibold">
      {{ error || '결제 처리 중 오류가 발생했습니다' }}
    </h1>
    <div class="mt-10 px-5 w-full">
      <BaseButton variant="primary" size="lg" @click="goToHome"> 돌아가기 </BaseButton>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import CheckSymbol from '@/assets/icons/CheckSymbol.svg'

export default {
  name: 'PaymentSuccess',
  components: {
    AppHeader,
    BaseButton,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const paymentData = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const isFromFanMeeting = ref(false)

    const goToHome = () => {
      router.push('/')
    }

    const goToMobileTicket = () => {
      router.push('/fancard/mobile-ticket')
    }

    const processPaymentSuccess = async () => {
      const params = route.query
      const paymentId = params.paymentId

      // 팬미팅 예약에서 온 경우는 시뮬레이션이므로 파라미터 체크 생략
      if (params.fromFanMeeting === 'true') {
        paymentData.value = {
          orderId: `fanmeeting_${params.fanMeetingId}_${Date.now()}`,
          amount: params.amount,
          paymentMethod: '간편결제',
          createdAt: new Date().toISOString()
        }
        return
      }

      if (!params.paymentKey || !params.orderId || !params.amount) {
        error.value = '필수 결제 정보가 누락되었습니다.'
        return
      }

      isLoading.value = true

      try {
        const approveResponse = await fetch(`/api/payments/${paymentId}/approve`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey: params.paymentKey,
            orderId: params.orderId,
            amount: parseInt(params.amount),
          }),
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
          createdAt: approvedData.createdAt || new Date().toISOString(),
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
      isFromFanMeeting.value = route.query.fromFanMeeting === 'true'
      processPaymentSuccess()
    })

    return {
      paymentData,
      isLoading,
      error,
      isFromFanMeeting,
      goToHome,
      goToMobileTicket,
      CheckSymbol,
    }
  },
}
</script>
