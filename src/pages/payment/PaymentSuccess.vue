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
    <div class="fixed bottom-14 left-5 right-5 flex gap-4">
      <!-- 홈으로 가기 버튼 (공통, 왼쪽) -->
      <BaseButton variant="cancel" size="md" @click="goToHome" class="flex-1">
        홈으로 가기
      </BaseButton>
      
      <!-- 오른쪽 버튼 (케이스별로 다름) -->
      <BaseButton 
        v-if="paymentType === 'MEMBERSHIP'"
        variant="primary" 
        size="md" 
        @click="goToFanCard" 
        class="flex-1"
      >
        팬카드 보러가기
      </BaseButton>
      <BaseButton 
        v-else-if="paymentType === 'RESERVATION'"
        variant="primary" 
        size="md" 
        @click="goToMobileTicket" 
        class="flex-1"
      >
        모바일 티켓 보러가기
      </BaseButton>
      <BaseButton 
        v-else
        variant="primary" 
        size="md" 
        @click="goToOrderFinish" 
        class="flex-1"
      >
        결제 내역 보러가기
      </BaseButton>
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
import BaseButton from '@/components/common/BaseButton.vue'
import CheckSymbol from '@/assets/icons/CheckSymbol.svg'
import paymentApi from '@/api/paymentApi'

export default {
  name: 'PaymentSuccess',
  components: {
    BaseButton,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const paymentData = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const paymentType = ref(null)

    const goToHome = () => {
      router.push('/')
    }

    const goToOrderFinish = () => {
      const params = route.query
      router.push({
        path: '/market/order/finish',
        query: {
          orderId: params.orderId,
          amount: params.amount,
          paymentKey: params.paymentKey
        }
      })
    }

    const goToMobileTicket = async () => {
      try {
        // 결제 정보에서 reservationId 가져오기
        const paymentDetail = await paymentApi.getPaymentDetail(route.query.paymentId)
        
        if (paymentDetail.reservationId || route.query.reservationId) {
          // query 방식으로 모바일 티켓 페이지로 이동
          router.push({
            path: '/fancard/mobile-ticket',
            query: {
              fanMeetingId: route.query.fanMeetingId || route.query.meetingId,
              reservationId: route.query.reservationId || paymentDetail.reservationId,
              seatId: route.query.seatId
            }
          })
        } else {
          // 일반 모바일 티켓 페이지로 이동
          router.push('/fancard/mobile-ticket')
        }
      } catch (error) {
        console.error('모바일 티켓 이동 중 오류:', error)
        // 오류 시 일반 페이지로 이동
        router.push('/fancard/mobile-ticket')
      }
    }

    const goToFanCard = () => {
      router.push('/fancard')
    }

    const processPaymentSuccess = async () => {
      const params = route.query
      const paymentId = params.paymentId

      if (!paymentId) {
        error.value = 'paymentId가 누락되었습니다.'
        return
      }

      isLoading.value = true

      try {
        // 1. 먼저 결제 정보를 가져와서 paymentType 확인
        const paymentDetail = await paymentApi.getPaymentDetail(paymentId)
        paymentType.value = paymentDetail.paymentType
        
        // 2. 팬미팅 예약에서 온 경우는 시뮬레이션이므로 승인 생략
        if (params.fromFanMeeting === 'true') {
          paymentData.value = {
            orderId: `fanmeeting_${params.fanMeetingId}_${Date.now()}`,
            amount: params.amount,
            paymentMethod: '간편결제',
            createdAt: new Date().toISOString(),
          }
          return
        }

        // 3. 실제 결제 승인 처리
        if (!params.paymentKey || !params.orderId || !params.amount) {
          error.value = '필수 결제 정보가 누락되었습니다.'
          return
        }

        const approvedData = await paymentApi.approvePayment(paymentId, {
          paymentKey: params.paymentKey,
          orderId: params.orderId,
          amount: parseInt(params.amount, 10),
        })
        
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
      processPaymentSuccess()
    })

    return {
      paymentData,
      isLoading,
      error,
      paymentType,
      goToHome,
      goToMobileTicket,
      goToFanCard,
      goToOrderFinish,
      CheckSymbol,
    }
  },
}
</script>
