<template>
  <div class="w-full min-h-screen bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <button @click="goBack" class="p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-black">결제하기</h1>
      <div class="w-6"></div>
    </div>

    <div class="px-4 pb-24">
      <!-- Order Summary -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6 mt-4">
        <h2 class="text-lg font-bold text-black mb-3">주문 정보</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">팬미팅</span>
            <span class="text-black font-medium">2025 여단오 팬미팅 '내가 제일 예뻐'</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">장소</span>
            <span class="text-black">올림픽공원 체조경기장</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">일시</span>
            <span class="text-black">2025년 8월 15일 (목) 오후 7:00</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">좌석</span>
            <span class="text-black font-medium">{{ selectedSeat }}</span>
          </div>
          <hr class="my-3">
          <div class="flex justify-between text-lg font-bold">
            <span class="text-black">총 결제금액</span>
            <span class="text-brand-accent">{{ totalPrice }}원</span>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="mb-6">
        <h3 class="text-lg font-bold text-black mb-4">결제 방법</h3>
        <div class="space-y-3">
          <label 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors"
            :class="{
              'border-brand-primary bg-brand-primary bg-opacity-10': selectedPaymentMethod === method.id,
              'border-gray-200': selectedPaymentMethod !== method.id
            }"
          >
            <input 
              type="radio" 
              :value="method.id" 
              v-model="selectedPaymentMethod"
              class="sr-only"
            >
            <div class="flex items-center">
              <div class="w-6 h-6 mr-3">
                <svg v-if="method.id === 'kb'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" fill="#FFB800" stroke="#FFB800" stroke-width="2"/>
                  <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">KB</text>
                </svg>
                <svg v-else-if="method.id === 'kakao'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#FEE500"/>
                  <path d="M12 6C8.5 6 6 8.5 6 11.5C6 13.5 7.5 15.5 9.5 16.5L8.5 19.5L11.5 17.5C11.7 17.5 11.8 17.5 12 17.5C15.5 17.5 18 15 18 11.5C18 8.5 15.5 6 12 6Z" fill="#3C1E1E"/>
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#03C75A"/>
                  <path d="M16 10L12 14L8 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="font-medium text-black">{{ method.name }}</span>
            </div>
          </label>
        </div>
      </div>



      <!-- Agreement -->
      <div class="mb-6">
        <label class="flex items-start">
          <input 
            type="checkbox" 
            v-model="agreedToTerms"
            class="mt-1 mr-3 w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
          >
          <span class="text-sm text-gray-700">
            <span class="font-medium">결제 진행 동의</span><br>
            주문 내용을 확인하였으며, 결제에 동의합니다.
          </span>
        </label>
      </div>
    </div>

    <!-- Bottom Spacer for Navigation -->
    <div class="h-20"></div>

    <!-- Bottom Button -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
      <div class="max-w-sm mx-auto px-4">
        <button 
          @click="processPayment"
          :disabled="!canProceed"
          :class="{
            'bg-brand-primary text-black': canProceed,
            'bg-gray-300 text-gray-500': !canProceed
          }"
          class="w-full py-4 rounded-xl font-bold text-lg transition-colors"
        >
          {{ totalPrice }}원 결제하기
        </button>
      </div>
    </div>

    <!-- Loading Modal -->
    <div v-if="isProcessing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p class="text-gray-700">결제 처리 중...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedSeat = ref('')
const totalPrice = ref('36,000')
const selectedPaymentMethod = ref('kb')
const agreedToTerms = ref(false)
const isProcessing = ref(false)

const paymentMethods = [
  { id: 'kb', name: 'KB페이' },
  { id: 'kakao', name: '카카오페이' },
  { id: 'naver', name: '네이버페이' }
]

const cardInfo = ref({
  number: '',
  expiry: '',
  cvc: '',
  name: ''
})

const canProceed = computed(() => {
  return agreedToTerms.value && selectedPaymentMethod.value
})

const formatCardNumber = () => {
  let value = cardInfo.value.number.replace(/\D/g, '')
  value = value.replace(/(\d{4})(?=\d)/g, '$1-')
  cardInfo.value.number = value
}

const formatExpiry = () => {
  let value = cardInfo.value.expiry.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  cardInfo.value.expiry = value
}

const goBack = () => {
  router.go(-1)
}

const processPayment = async () => {
  if (!canProceed.value) return
  
  isProcessing.value = true
  
  try {
    // 결제 처리 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 결제 완료 후 성공 페이지로 이동
    router.push({
      path: '/payment-success',
      query: {
        fanMeetingId: route.params.id,
        seat: selectedSeat.value,
        amount: totalPrice.value.replace(',', '')
      }
    })
  } catch (error) {
    alert('결제 처리 중 오류가 발생했습니다.')
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  // 쿼리 파라미터에서 좌석 정보 가져오기
  selectedSeat.value = route.query.seat || 'F9'
  if (route.query.price) {
    const price = parseInt(route.query.price)
    totalPrice.value = price.toLocaleString()
  }
})
</script>