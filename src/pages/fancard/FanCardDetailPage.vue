<script setup>
import { ref, onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'
import AppNav from '@/components/layout/AppNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { fancardApi } from '@/api/fancardApi'
import { cancelMembership } from '@/api/membershipApi'
import { useAuthStore } from '@/stores/authStore'

import tomoTomoImg from '@/assets/fancard/TomoTomo.svg'
import iconCreditCard from '@/assets/fancard/icon-credit-card.svg'
import iconCreditCard2 from '@/assets/fancard/icon-credit-card2.svg'
import iconGift from '@/assets/fancard/icon-gift.svg'
import iconFanzip from '@/assets/fancard/icon-fanzip.svg'

import Heart from '@/assets/fancard/Heart.svg'
import BrokenHeart from '@/assets/fancard/BrokenHeart.svg'
import Cart from '@/assets/fancard/Cart.svg'
import Ticket from '@/assets/fancard/Ticket.svg'

const router = useRouter()
const route = useRoute()
const cardId = route.params.id
const authStore = useAuthStore()

const goToTicket = (fanMeetingId) => {
  router.push({
    path: '/fancard/mobile-ticket',
    query: { fanMeetingId },
  })
}

const fanCard = ref(null)
const isLoading = ref(false)
const error = ref(null)

const fetchFancardDetail = async () => {
  try {
    isLoading.value = true
    error.value = null

    // 개발 환경에서 토큰이 없는 경우 테스트 토큰 설정 (user_id: 8 for 하경한)
    if (import.meta.env.DEV && !authStore.token) {
      console.warn('개발 환경: 테스트 JWT 토큰 설정 (user_id: 8)')
      const testToken =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBQ0NFU1NfVE9LRU4iLCJ1c2VySWQiOjgsImlhdCI6MTc1NDUzMjYxMSwiZXhwIjoxNzU0NTM0NDExfQ.nkTxBnNSQtR-gojKR89QV4hCQ9xNAZAWDMYyKuIrMdU'
      authStore.setToken(testToken)
    }

    const response = await fancardApi.getFancardDetail(cardId)
    const data = response.data

    fanCard.value = {
      cardId: data.cardId,
      cardNumber: data.cardNumber,
      nickname: data.influencer?.influencerName || '인플루언서',
      grade: data.membership?.grade?.gradeName || 'Silver',
      joinDate: formatDate(data.membership?.subscriptionStart),
      joinDday: calculateDaysDiff(data.membership?.subscriptionStart),
      monthlyFee: data.membership?.monthlyAmount || 0,
      totalPaid: data.membership?.totalPaidAmount || 0,
      benefits: formatBenefits(data.benefits || []),
      history: formatPaymentHistory(data.paymentHistory || []), // 결제 히스토리를 추억 형식으로 변환
      imageUrl: data.cardDesignUrl, // MySQL에서 받은 URL 그대로 사용
      membershipId: data.membership?.membershipId, // 구독 취소용 멤버십 ID 추가
    }
  } catch (err) {
    console.error('팬카드 상세 조회 실패:', err)
    error.value = '팬카드 정보를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\./g, '.')
    .slice(0, -1)
}

const calculateDaysDiff = (startDate) => {
  if (!startDate) return 0
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = Math.abs(now - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const formatBenefits = (benefits) => {
  return benefits.map((benefit) => benefit.description || benefit)
}

const formatPaymentHistory = (paymentHistory) => {
  return paymentHistory.map((payment) => ({
    title:
      // `구독 결제 완료`,
      // '꿀떡 구매',
      // '팬미팅 예매',
      '구독 해지',

    amount: payment.amount,
    date: formatDate(payment.paymentDate || payment.paidAt),
    bold: false,
  }))
}

const imageError = ref(false)

const handleImageError = (event) => {
  console.warn(`팬카드 이미지 로드 실패`)
  imageError.value = true
  event.target.style.display = 'none' // 실패한 이미지 숨김
}

const getBadgeClass = (grade) => {
  switch (grade) {
    case 'VIP':
      return 'badge badge-vip'
    case 'Gold':
      return 'badge badge-gold'
    case 'Silver':
      return 'badge badge-silver'
    case 'White':
      return 'badge badge-white'
    default:
      return 'badge badge-silver'
  }
}

// 구독 취소 기능
const isConfirmingCancel = ref(false)
const isCancelling = ref(false)

const handleCancelSubscription = async () => {
  if (!fanCard.value) return

  if (!isConfirmingCancel.value) {
    // 첫 지지 클릭 - 확인 메시지 표시
    isConfirmingCancel.value = true
    setTimeout(() => {
      isConfirmingCancel.value = false
    }, 5000) // 5초 후 자동 취소
    return
  }

  // 두 번째 클릭 - 실제 취소 실행
  try {
    isCancelling.value = true

    // API 함수 사용으로 변경
    await cancelMembership(fanCard.value.membershipId)

    alert('구독이 취소되었습니다.')
    // 페이지 새로고침 또는 메인 페이지로 이동
    router.push('/fancard')
  } catch (error) {
    console.error('구독 취소 중 오류:', error)
    alert(`구독 취소에 실패했습니다: ${error.message || '알 수 없는 오류'}`)
  } finally {
    isCancelling.value = false
    isConfirmingCancel.value = false
  }
}

onMounted(() => {
  fetchFancardDetail()
})
</script>

<template>
  <AppHeader type="back" />

  <!-- 로딩 상태 -->
  <div v-if="isLoading" class="flex items-center justify-center min-h-screen bg-subtle-bg">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
  </div>

  <!-- 에러 상태 -->
  <div
    v-else-if="error"
    class="flex flex-col items-center justify-center min-h-screen bg-subtle-bg px-5"
  >
    <p class="text-text-emphasis text-center mb-4">{{ error }}</p>
    <button
      @click="fetchFancardDetail"
      class="px-4 py-2 bg-brand-primary text-black rounded-lg hover:bg-brand-accent"
    >
      다시 시도
    </button>
  </div>

  <!-- 팬카드 정보 -->
  <div v-else-if="fanCard" class="bg-subtle-bg min-h-screen pt-24 pb-28 flex flex-col">
    <!-- 1. 상단 이미지 + 배지 -->
    <div class="relative mx-5 h-[180px] rounded-lg overflow-hidden shadow-md">
      <img
        v-if="!imageError && fanCard.imageUrl"
        :src="fanCard.imageUrl"
        alt="fan card"
        class="w-full h-full object-cover rounded-lg fancard-image"
        @error="handleImageError"
      />
      <!-- 이미지 로드 실패 시 표시할 fallback -->
      <div
        v-else
        class="w-full h-[180px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-lg fancard-detail-fallback"
      >
        이미지를 불러올 수 없습니다
      </div>
      <span :class="getBadgeClass(fanCard.grade)" class="absolute top-2 right-2">
        {{ fanCard.grade }}
      </span>
    </div>

    <!-- 2. 예약 안내 배너 (20px 아래) -->
    <div
      class="mx-5 mt-5 h-[47px] bg-base-bg rounded-lg shadow-md flex flex-col items-center justify-center text-xs font-semibold text-center"
    >
      예약한 팬미팅 내역이 있어요.<br />
      <span
        class="text-base-text text-xs font-semibold underline cursor-pointer"
        @click="goToTicket(fanCard.fanMeetingId)"
      >
        바로 확인하기
      </span>
    </div>

    <!-- 3. 기본 정보 박스 -->
    <div class="mx-5 mt-5 space-y-5">
      <!-- 닉네임 + Silver 배지 -->
      <div class="bg-base-bg rounded-lg shadow-md p-4 space-y-3">
        <div class="flex items-center gap-2">
          <span class="font-bold text-base-text text-base">{{ fanCard.nickname }}</span>
          <span :class="getBadgeClass(fanCard.grade)">{{ fanCard.grade }}</span>
        </div>
        <p class="text-sm subtle-text flex items-center gap-2">
          <span>가입일</span>
          <span class="ml-1">
            {{ fanCard.joinDate }}
            <span class="font-bold">(D+{{ fanCard.joinDday }})</span>
          </span>
        </p>
      </div>

      <!-- 월 납입 / 총 납입 박스 -->
      <div class="bg-base-bg rounded-lg shadow-md p-4 space-y-2 text-sm">
        <p class="flex items-center gap-2">
          <img :src="iconCreditCard" class="w-4 h-4" alt="월 납입" />
          <span>월 납입</span>
          <span class="font-bold ml-1">{{ fanCard.monthlyFee.toLocaleString() }}원</span>
        </p>
        <p class="flex items-center gap-2">
          <img :src="iconCreditCard2" class="w-4 h-4" alt="총 납입" />
          <span>총 납입</span>
          <span class="font-bold ml-1">{{ fanCard.totalPaid.toLocaleString() }}원</span>
        </p>
      </div>
    </div>

    <!-- 4. 혜택 박스 -->
    <div class="mx-5 mt-5 bg-base-bg rounded-lg shadow-md p-4">
      <div class="flex items-center mb-2 gap-2 border-b border-subtle-border pb-2">
        <img :src="iconGift" class="w-5 h-5" alt="혜택" />
        <h3 class="font-semibold text-base">혜택</h3>
      </div>
      <ul class="list-none text-sm space-y-1 pl-1">
        <li v-for="(benefit, idx) in fanCard.benefits" :key="idx" v-html="benefit"></li>
      </ul>
    </div>

    <!-- 5. 구독 히스토리 -->
    <div class="mx-5 mt-5 bg-base-bg rounded-lg shadow-md px-[11px] py-4 pl-5">
      <div class="flex items-center mb-2 gap-2 border-b border-subtle-border pb-2">
        <img :src="iconFanzip" class="w-5 h-5" alt="추억" />
        <h3 class="font-semibold text-base">{{ fanCard.nickname }}님와의 추억</h3>
      </div>
      <ul class="divide-y divide-subtle-border text-sm">
        <li v-for="(item, idx) in fanCard.history" :key="idx" class="py-2 flex gap-4">
          <img v-if="item.title.includes('결제')" :src="Heart" />
          <img v-else-if="item.title.includes('예매')" :src="Ticket" />
          <img v-else-if="item.title.includes('구매')" :src="Cart" />
          <img v-else-if="item.title.includes('해지')" :src="BrokenHeart" />
          <div>
            <p :class="{ 'font-bold': item.bold }">{{ item.title }}</p>
            <p v-if="item.amount" class="text-base">{{ item.amount.toLocaleString() }}원</p>
            <p class="text-xs mt-[1px]">{{ item.date }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 6. 하단 구독 취소 버튼 -->
    <div class="w-full flex justify-center mt-10">
      <button
        @click="handleCancelSubscription"
        :disabled="isCancelling"
        :class="{
          'text-red-500 hover:text-red-600': isConfirmingCancel,
          'text-subtle-text hover:text-red-400': !isConfirmingCancel,
        }"
        class="text-sm transition-colors duration-200 disabled:opacity-50"
      >
        <span v-if="isCancelling">취소 중...</span>
        <span v-else-if="isConfirmingCancel">정말로 취소하시겠습니까? (다시 클릭)</span>
        <span v-else>구독 취소하기</span>
      </button>
    </div>

    <app-nav class="fixed bottom-0 left-0 w-full" />
  </div>
</template>

<style scoped>
.fancard-image {
  /* 이미지 기본 표시 */
}

.fancard-detail-fallback {
  /* Detail 페이지 fallback div 크기 고정 */
  width: 100% !important;
  height: 180px !important;
}
</style>
