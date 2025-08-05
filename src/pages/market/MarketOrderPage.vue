<!-- src/pages/MarketOrderPage.vue -->
<template>
  <!-- 1) 헤더 -->
  <AppHeader
    type="back-title"
    title="결제하기"
    class="fixed top-0 left-0 right-0 z-30 h-12 bg-white"
  />

  <!-- 2) 내용 -->
  <div class="pt-[68px] bg-subtle-bg min-h-screen pb-32">
    <div class="px-5 space-y-5">
      <!-- 3) 유저 정보 & 구매 정보-->
      <div class="bg-white rounded-xl p-5 space-y-5">
        <!-- 3-1) 유저 정보 -->
        <div class="space-y-1">
          <p class="text-xl font-semibold">{{ cartData.name }}</p>
          <p class="text-base font-medium text-subtle-text">{{ cartData.phone }}</p>
          <p class="text-base">{{ cartData.address }}</p>
        </div>

        <!-- 구분선 -->
        <hr class="border-subtle-border" />

        <!-- 3-2) 구매 물품 정보 -->
        <div class="space-y-5">
          <div v-for="item in orderItems" :key="item.productId" class="flex items-start space-x-3">
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

      <!-- 4) 결제 방법 -->
      <div class="bg-white rounded-xl p-5">
        <BasePaymentOption v-model="selectedPayment" />
      </div>

      <!-- 5) 동의 정보 -->
      <p class="text-xs text-subtle-text text-center">
        주문내용을 확인하였으며, 정보 제공 등에 동의합니다.
      </p>
    </div>
  </div>

  <!-- 6) 결제 네비게이션 바 -->
  <nav
    class="fixed bottom-0 left-0 w-full h-20 bg-base-bg border-t border-nav-stroke rounded-t-2xl flex items-center justify-center z-50"
  >
    <BaseButton
      :variant="selectedPayment !== null ? 'primary' : 'cancel'"
      size="lg"
      :disabled="selectedPayment === null"
      @click="selectedPayment !== null && goToPaymentPage()"
    >
      <span class="font-extrabold">{{ orderTotal.toLocaleString() }}원</span>
      <span class="font-semibold">결제하기</span>
    </BaseButton>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BasePaymentOption from '@/components/common/BasePaymentOption.vue'
import marketApi from '@/api/marketApi'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const cartData = ref({ items: [], grandTotal: 0, address: '', name: '' })

// 1) 로드
const loadCart = async () => {
  cartData.value = await marketApi.getCartItems()
}
onMounted(loadCart)

// 2) 바로 구매 / 카트에서 구매
const orderItems = computed(() => {
  if (route.query.type === 'buy') {
    const pid = Number(route.query.productId)
    const qty = Number(route.query.quantity) || 1
    const prod = cartData.value.items.find((i) => i.productId === pid)
    if (!prod) return []
    return [
      {
        ...prod,
        quantity: qty,
        totalPrice: prod.discountedPrice * qty,
      },
    ]
  }
  return cartData.value.items
    .filter((i) => i.isSelected)
    .map((i) => ({
      ...i,
      totalPrice: i.discountedPrice * i.quantity,
    }))
})

// 3) 가격 계산
// 3-1) 정가
const originalTotal = computed(() =>
  orderItems.value.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
)

// 3-2) 배송비
const shippingTotal = computed(() => orderItems.value.reduce((sum, i) => sum + i.shippingPrice, 0))

// 3-3) 할인가
const discountTotal = computed(
  () =>
    originalTotal.value +
    shippingTotal.value -
    orderItems.value.reduce((sum, i) => sum + i.totalPrice, 0),
)

// 3-4) 할인가 + 배송비
const orderTotal = computed(
  () => orderItems.value.reduce((sum, i) => sum + i.totalPrice, 0) + shippingTotal.value,
)

// 4) 결제 방법 선택
const selectedPayment = ref(null)

// 5) 결제로 이동
function goToPaymentPage() {
  console.log('주문 요청:', orderItems.value, selectedPayment.value)
  router.push({ name: 'PaymentPage' })
}
</script>
