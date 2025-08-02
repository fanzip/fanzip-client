<template>
  <div class="w-full min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div class="w-6"></div>
      <h1 class="text-lg font-semibold text-black">결제 완료</h1>
      <button @click="goHome" class="p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6l12 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Success Content -->
    <div class="flex-1 flex flex-col items-center justify-center px-4">
      <!-- Success Icon -->
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-black mb-2">결제가 완료되었습니다!</h2>
      <p class="text-gray-600 text-center mb-8">팬미팅 예매가 성공적으로 완료되었습니다.</p>

      <!-- Order Details -->
      <div class="w-full max-w-sm bg-gray-50 rounded-lg p-4 mb-8">
        <h3 class="font-bold text-black mb-3">예매 정보</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">팬미팅</span>
            <span class="text-black">2025 여단오 팬미팅</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">좌석</span>
            <span class="text-black font-medium">{{ selectedSeat }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">결제금액</span>
            <span class="text-brand-accent font-bold">{{ amount }}원</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="w-full max-w-sm space-y-3">
        <button 
          @click="viewTicket"
          class="w-full bg-brand-primary text-black py-4 rounded-xl font-bold text-lg transition-colors hover:bg-brand-accent"
        >
          티켓 확인하기
        </button>
        <button 
          @click="goHome"
          class="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-medium text-lg transition-colors hover:bg-gray-200"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedSeat = ref('')
const amount = ref('')
const fanMeetingId = ref('')

const goHome = () => {
  router.push('/')
}

const viewTicket = () => {
  // 티켓 상세 페이지로 이동
  router.push({
    path: '/ticket',
    query: {
      fanMeetingId: fanMeetingId.value,
      seat: selectedSeat.value,
      amount: amount.value
    }
  })
}

onMounted(() => {
  // 쿼리 파라미터에서 정보 가져오기
  selectedSeat.value = route.query.seat || ''
  amount.value = route.query.amount ? parseInt(route.query.amount).toLocaleString() : ''
  fanMeetingId.value = route.query.fanMeetingId || ''
})
</script>