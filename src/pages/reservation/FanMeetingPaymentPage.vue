<template>
  <div class="w-full min-h-screen bg-subtle-bg">
    <AppHeader type="back-title" title="결제하기" />

    <div class="w-full max-w-[393px] mx-auto min-h-screen">
      <div class="px-5 md:px-0 pt-[68px] pb-24 space-y-5">
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
              <span class="text-text-emphasis font-bold text-base">
                {{ totalPrice.toLocaleString() }}원
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-5">
          <BasePaymentOption v-model="selectedPaymentMethod" />
        </div>

        <p class="text-xs text-subtle-text text-center">
          주문내용을 확인하였으며, 정보 제공 등에 동의합니다.
        </p>
      </div>

      <BottomButton
        @click="processPayment"
        :disabled="!canProceed"
        :variant="canProceed ? 'primary' : 'cancel'"
        size="lg"
      >
        <span class="font-extrabold">{{ totalPrice.toLocaleString() }}원</span>
        <span class="font-semibold">결제하기</span>
      </BottomButton>

      <div
        v-if="isProcessing"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
import { fetchFanMeeting } from '@/api/fanMeetingApi'

import dayjs from 'dayjs'
const router = useRouter()
const route = useRoute()

const paymentData = ref(null)

// 금액/옵션
const meetingId = ref(null)
const seatId = ref(null)
const selectedSeat = ref('')

const currentFanMeeting = ref({
  title: '팬미팅',
  date: '',
  venue: '장소 미정',
})

const ticketPrice = ref(20000)
const serviceFee = ref(3000)
const selectedPaymentMethod = ref('TOSSPAY')
const isProcessing = ref(false)

const totalPrice = computed(() => ticketPrice.value + serviceFee.value)
const canProceed = computed(
  () => !!selectedPaymentMethod.value && !!meetingId.value && !!seatId.value,
)

const ready = computed(() => !!meetingId.value && !!seatId.value && !!currentFanMeeting.value)

const processPayment = async () => {
  if (!canProceed.value) return
  
  isProcessing.value = true
  
  try {
    // 토스페이먼츠 스크립트 로드 확인
    if (typeof window.TossPayments === 'undefined') {
      throw new Error('토스페이먼츠 스크립트가 로드되지 않았습니다.')
    }

    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY
    const customerKey = import.meta.env.VITE_TOSS_CUSTOMER_KEY
    const tossPayments = window.TossPayments(clientKey)
    
    // 주문 정보 생성
    const orderId = `reservation_${route.query.reservationId || 'temp'}_${route.query.paymentId}`
    const orderName = `${currentFanMeeting.value.title} 예매`
    
    // 위젯 API 사용
    const widgets = tossPayments.widgets({ customerKey })
    await widgets.setAmount({ currency: 'KRW', value: totalPrice.value })
    
    // 임시 div를 body에 추가하여 결제 수단 렌더링
    const tempDiv = document.createElement('div')
    tempDiv.id = 'temp-payment-methods'
    tempDiv.style.position = 'fixed'
    tempDiv.style.top = '-9999px'
    tempDiv.style.left = '-9999px'
    document.body.appendChild(tempDiv)

    await widgets.renderPaymentMethods({
      selector: '#temp-payment-methods',
      variantKey: 'DEFAULT',
    })

    // 결제 요청
    await widgets.requestPayment({
      orderId,
      orderName,
      successUrl: `${window.location.origin}/payments/success?paymentId=${route.query.paymentId}`,
      failUrl: `${window.location.origin}/payments/fail?paymentId=${route.query.paymentId}`,
      customerEmail: 'customer123@gmail.com',
      customerName: '팬집',
      customerMobilePhone: '01012341234',
    })

    // 임시 div 제거
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv)
    }
  } catch (error) {
    console.error('결제 요청 실패:', error)
    alert('결제 요청에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isProcessing.value = false
  }
}

onMounted(async () => {
  meetingId.value = route.query.meetingId
  seatId.value = route.query.seatId
  selectedSeat.value = route.query.seat

  try {
    const data = await fetchFanMeeting(meetingId.value) // ← API 레이어 함수 사용
    currentFanMeeting.value = {
      title: data.title || '팬미팅',
      date: dayjs(data.meetingDate).format('YYYY년 M월 D일 (dd) A h:mm'),
      venue: data.venueName || '장소 미정',
    }
  } catch (e) {
    console.error('[fan-meeting load error]', e)
  }
})
</script>
