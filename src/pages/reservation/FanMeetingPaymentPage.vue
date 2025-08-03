<template>
  <div class="w-full min-h-screen bg-subtle-bg">
    <!-- Header -->
    <AppHeader type="back-title" title="결제하기" />

    <!-- White Container -->
    <div class="w-full max-w-[393px] mx-auto min-h-screen">
      <!-- Content with spacing -->
      <div class="px-5 md:px-0 pt-[68px] pb-7 space-y-5">
        <!-- Order Summary -->
        <div class="bg-white rounded-lg p-4">
          <div class="text-left">
            <h1 class="text-xl font-bold text-black mb-3">주문 정보</h1>
            <h2 class="text-base text-black mb-1">{{ currentFanMeeting.title }}</h2>
            <p class="text-base mb-2 text-subtle-text">{{ currentFanMeeting.date }}</p>
            <div class="flex items-center mb-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="mr-1"
              >
                <path
                  d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
                  stroke="#808080"
                  stroke-width="2"
                />
                <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="2" />
              </svg>
              <span class="text-black text-base">{{ currentFanMeeting.venue }}</span>
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

            <hr class="mx-2 mb-4 border-subtle-border" />

            <div class="flex justify-between">
              <span class="text-black font-bold text-base">총 결제금액</span>
              <span class="text-red-500 font-bold text-base">{{ totalPrice.toLocaleString() }}원</span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <PaymentMethodSelector v-model="selectedPaymentMethod" />

        <!-- Agreement -->
        <div class="bg-white rounded-lg p-4 mt-5">
          <label class="flex items-start">
            <input
              type="checkbox"
              v-model="agreedToTerms"
              class="mt-1 mr-3 w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 accent-brand-primary"
              style="transform: scale(1.2)"
            />
            <span class="text-sm text-gray-700">
              <span class="font-medium">결제 진행 동의</span><br />
              주문 내용을 확인하였으며, 결제에 동의합니다.
            </span>
          </label>
        </div>
      </div>

      <!-- Bottom Button -->
      <BottomButton
        @click="processPayment"
        :disabled="!canProceed"
        :variant="canProceed ? 'primary' : 'cancel'"
        size="lg"
      >
        {{ totalPrice.toLocaleString() }}원 결제하기
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
import PaymentMethodSelector from '@/components/common/PaymentMethodSelector.vue'
import { fanMeetingData } from '@/data/fanMeetingData.js'

const router = useRouter()
const route = useRoute()

const selectedSeat = ref('')
const ticketPrice = ref(33000)
const serviceFee = ref(3000)
const selectedPaymentMethod = ref('kb')
const agreedToTerms = ref(false)
const isProcessing = ref(false)

const totalPrice = computed(() => {
  return ticketPrice.value + serviceFee.value
})

// 현재 팬미팅 정보
const currentFanMeeting = computed(() => {
  return fanMeetingData[route.params.id] || fanMeetingData[1]
})


const canProceed = computed(() => {
  return agreedToTerms.value && selectedPaymentMethod.value
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
