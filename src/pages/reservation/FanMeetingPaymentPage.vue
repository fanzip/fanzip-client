<template>
  <div class="w-full min-h-screen bg-subtle-bg">
    <!-- Header -->
    <AppHeader type="back-title" title="결제하기" />

    <!-- White Container -->
    <div class="w-full max-w-[393px] mx-auto min-h-screen">
      <!-- Content with spacing -->
      <div class="px-5 md:px-0 pt-[68px] pb-24 space-y-5">
        <!-- Order Summary -->
        <div class="bg-white rounded-lg p-5">
          <div class="text-left">
            <h1 class="text-xl font-bold text-black mb-3">주문 정보</h1>
            <h2 class="text-base text-black mb-1">{{ currentFanMeeting.title }}</h2>
            <p class="text-base mb-2 text-subtle-text">{{ currentFanMeeting.date }}</p>
            <div class="flex items-center mb-4">
              <img src="@/assets/market/map-pin-black.svg" alt="map-pin" class="w-5 h-5" />

              <span class="text-black text-base pl-1">{{ currentFanMeeting.venue }}</span>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-black text-base">일반석({{ selectedSeat }})</span>
                <span class="text-black text-base">{{ ticketPrice.toLocaleString() }}원</span>
              </div>
              <div class="flex justify-between">
                <span class="text-black text-base">예매 수수료</span>
                <span class="text-black text-base">{{ serviceFee.toLocaleString() }}원</span>
              </div>
            </div>

            <hr class="border-subtle-border" />

            <div class="flex justify-between pt-5">
              <span class="text-black font-bold text-base">총 결제금액</span>
              <span class="text-text-emphasis font-bold text-base"
                >{{ totalPrice.toLocaleString() }}원</span
              >
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-xl p-5">
          <BasePaymentOption v-model="selectedPaymentMethod" />
        </div>

        <!-- Agreement -->
        <p class="text-xs text-subtle-text text-center">
          주문내용을 확인하였으며, 정보 제공 등에 동의합니다.
        </p>
      </div>

      <!-- Bottom Button -->
      <BottomButton
        @click="processPayment"
        :disabled="!canProceed"
        :variant="canProceed ? 'primary' : 'cancel'"
        size="lg"
      >
        <span class="font-extrabold">{{ totalPrice.toLocaleString() }}원</span>
        <span class="font-semibold">결제하기</span>
      </BottomButton>

      <!-- Loading Modal -->
      <div
        v-if="isProcessing"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"
          ></div>
          <p class="text-gray-700">결제 처리 중...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomButton from '@/components/common/ButtonNav.vue'
import BasePaymentOption from '@/components/common/BasePaymentOption.vue'
import { fanMeetingData } from '@/data/fanMeetingData.js'

const router = useRouter()
const route = useRoute()

const selectedSeat = ref('')
const ticketPrice = ref(33000)
const serviceFee = ref(3000)
const selectedPaymentMethod = ref(null)
const isProcessing = ref(false)

const totalPrice = computed(() => {
  return ticketPrice.value + serviceFee.value
})

// 현재 팬미팅 정보
const currentFanMeeting = computed(() => {
  return fanMeetingData[route.params.id] || fanMeetingData[1]
})

const canProceed = computed(() => {
  return selectedPaymentMethod.value
})

const processPayment = async () => {
  if (!canProceed.value) return

  isProcessing.value = true

  try {
    // 결제 처리 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 결제 완료 후 성공 페이지로 이동
    router.push({
      path: '/payments/success',
      query: {
        fanMeetingId: route.params.id,
        seat: selectedSeat.value,
        amount: totalPrice.value,
        reservationId: 12358, // TODO: 실제 예약 생성 후 받은 reservationId 사용
        fromFanMeeting: 'true',
      },
    })
  } catch {
    alert('결제 처리 중 오류가 발생했습니다.')
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  // 쿼리 파라미터에서 좌석 정보 가져오기
  selectedSeat.value = route.query.seat || 'F9'
  if (route.query.price) {
    ticketPrice.value = parseInt(route.query.price)
  }
})
</script>
