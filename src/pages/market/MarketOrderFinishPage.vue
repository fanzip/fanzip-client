<!-- src/pages/MarketOrderFinishPage.vue -->
<template>
  <!-- 1) 헤더 -->
  <div class="fixed top-0 left-0 right-0 z-30 h-12 bg-white flex items-center px-5 border-b">
    <button @click="goToHome" class="flex items-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <h1 class="flex-1 text-center text-lg font-semibold">주문완료</h1>
    <div class="w-6"></div> <!-- 균형을 위한 공간 -->
  </div>

  <!-- 2) 내용 -->
  <div class="pt-[68px] bg-subtle-bg min-h-screen pb-32">
    <div class="px-5 space-y-5">
      <div v-if="isLoading" class="text-center py-8">
        <p class="text-lg">주문 정보를 불러오는 중...</p>
      </div>
      <div v-else-if="error" class="text-center py-8">
        <p class="text-lg text-red-500">{{ error }}</p>
      </div>
      <div v-else class="text-center font-bold text-xl py-4">
        <span class="text-brand-accent">주문완료 </span>
        <span>되었습니다</span>
      </div>

      <!-- 3) 유저 정보 & 구매 정보-->
      <div v-if="!isLoading && !error" class="bg-white rounded-xl p-5 space-y-5">
        <!-- 3-1) 유저 정보 -->
        <div class="space-y-1">
          <p class="text-xl font-semibold">{{ orderData.name }}</p>
          <p class="text-base font-medium text-subtle-text">{{ orderData.phone }}</p>
          <p class="text-base">{{ orderData.address1 }} {{ orderData.address2 }}</p>
          <p class="text-base">({{ orderData.zipcode }})</p>
        </div>

        <!-- 구분선 -->
        <hr class="border-subtle-border" />

        <!-- 3-2) 구매 물품 정보 -->
        <div class="space-y-5">
          <div v-for="item in displayItems" :key="item.productId" class="flex items-start space-x-3">
            <img
              :src="item.thumbnailImage"
              alt="썸네일"
              class="w-[85px] h-[85px] object-cover rounded"
            />
            <div class="flex-1 flex flex-col justify-between space-y-2">
              <p class="text-base font-medium line-clamp-2">
                {{ item.productName }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-base">{{ item.quantity }}개</span>
                <span class="text-base font-semibold">
                  {{ item.totalPrice.toLocaleString() }}원
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-subtle-border" />

        <!-- 3-3) 금액 정보 -->
        <div class="flex justify-between font-bold text-base">
          <span class="text-lg">주문금액</span>
          <span>{{ orderTotal.toLocaleString() }}원</span>
        </div>
        <div class="space-y-2 text-sm text-subtle-text">
          <div class="flex justify-between">
            <span>상품금액</span>
            <span>{{ originalTotal.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between">
            <span>배송비</span>
            <span>{{ shippingTotal.toLocaleString() }}원</span>
          </div>
          <div class="flex justify-between">
            <span>할인</span>
            <span class="text-text-emphasis"> -{{ discountTotal.toLocaleString() }}원 </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 네비게이션 바 -->
  <AppNav />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppNav from '@/components/layout/AppNav.vue'
import marketApi from '@/api/marketApi'

const route = useRoute()
const router = useRouter()

const orderData = ref({
  orderId: null,
  amount: 0,
  paymentKey: '',
  address1: '',
  address2: '',
  name: '',
  phone: '',
  zipcode: '',
})

const orderItems = ref([])
const isLoading = ref(true)
const error = ref(null)

// 주문 정보 및 상품 로드
async function loadOrderData() {
  try {
    const orderId = route.query.orderId
    const amount = route.query.amount
    const paymentKey = route.query.paymentKey
    
    if (!orderId) {
      throw new Error('주문 정보가 없습니다.')
    }
    
    // orderId에서 실제 숫자 추출 (order_6_15 -> 6)
    let actualOrderId = orderId
    if (typeof orderId === 'string' && orderId.startsWith('order_')) {
      const parts = orderId.substring(6).split('_')
      if (parts.length > 0) {
        actualOrderId = parts[0]
      }
    }
    
    // 주문 상세 정보 조회
    const orderDetail = await marketApi.getOrderDetail(actualOrderId)
    
    // 주문 정보 설정 - 실제 데이터 사용
    orderData.value = {
      orderId: actualOrderId,
      amount: Number(amount) || orderDetail.finalAmount || 0,
      paymentKey: paymentKey || '',
      address1: orderDetail.shippingAddress1 || '서울특별시 광진구 능동로 195-16',
      address2: orderDetail.shippingAddress2 || '602호',
      name: orderDetail.recipientName || '',
      phone: orderDetail.recipientPhone || '',
      zipcode: orderDetail.zipcode || '05006',
    }
    
    // 주문 상품 조회 - 실제 숫자 ID 사용
    orderItems.value = await marketApi.getOrderItems(actualOrderId)
  } catch (err) {
    console.error('주문 데이터 로드 실패:', err)
    error.value = err.message || '주문 정보를 불러올 수 없습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadOrderData)

const goToHome = () => {
  router.push('/')
}

const displayItems = computed(() => {
  return orderItems.value.map(item => ({
    ...item,
    totalPrice: item.finalPrice || (item.unitPrice * item.quantity)
  }))
})

// 가격 계산
const originalTotal = computed(() =>
  orderItems.value.reduce((sum, i) => sum + ((i.originalPrice || i.unitPrice) * i.quantity), 0),
)

const shippingTotal = computed(() => 
  orderItems.value.reduce((sum, i) => sum + (i.shippingPrice || 0), 0)
)

const discountTotal = computed(() => {
  const originalSum = orderItems.value.reduce((sum, i) => sum + ((i.originalPrice || i.unitPrice) * i.quantity), 0)
  const finalSum = orderItems.value.reduce((sum, i) => sum + i.finalPrice, 0)
  return originalSum - finalSum
})

const orderTotal = computed(() => orderData.value.amount)
</script>