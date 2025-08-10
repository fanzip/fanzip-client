<!-- src/pages/MarketOrderPage.vue -->
<template>
  <!-- 1) 헤더 -->
  <AppHeader
    type="back-title"
    title="결제내역"
    class="fixed top-0 left-0 right-0 z-30 h-12 bg-white"
  />

  <!-- 2) 내용 -->
  <div class="pt-[68px] bg-subtle-bg min-h-screen pb-32">
    <div class="px-5 space-y-5">
      <div class="text-center font-bold text-xl py-4">
        <span class="text-brand-accent">주문완료 </span>
        <span>되었습니다</span>
      </div>

      <!-- 3) 유저 정보 & 구매 정보-->
      <div class="bg-white rounded-xl p-5 space-y-5">
        <!-- 3-1) 유저 정보 -->
        <div class="space-y-1">
          <p class="text-xl font-semibold">{{ cartData.name }}</p>
          <p class="text-base font-medium text-subtle-text">{{ cartData.phone }}</p>
          <p class="text-base">{{ cartData.address1 }} {{ cartData.address2 }}</p>
          <p class="text-base">({{ cartData.zipcode }})</p>
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
    </div>
  </div>

  <!-- 네비게이션 바 -->
  <AppNav />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import marketApi from '@/api/marketApi'

const route = useRoute()
const router = useRouter()

const cartData = ref({
  items: [],
  grandTotal: 0,
  address1: '',
  address2: '',
  name: '',
  zipcode: '',
})

// 바로 구매용 임시 product
const buyItem = ref(null)

// 로드
onMounted(async () => {
  cartData.value = await marketApi.getCartItems()
})

async function loadAll() {
  // 장바구니 정보
  cartData.value = await marketApi.getCartItems()

  // 바로 구매 모드- 상세 조회
  if (route.query.type === 'buy') {
    const pid = Number(route.query.productId)
    const qty = Number(route.query.quantity) || 1

    const prod = await marketApi.getProductDetail(pid)
    buyItem.value = {
      productId: prod.productId,
      productName: prod.name,
      thumbnailImage: prod.thumbnailImage,
      unitPrice: prod.price,
      discountedPrice: prod.discountedPrice,
      shippingPrice: prod.shippingPrice,
      quantity: qty,
      totalPrice: prod.discountedPrice * qty,
    }
  }
}

onMounted(loadAll)

const orderItems = computed(() => {
  if (route.query.type === 'buy') {
    return buyItem.value ? [buyItem.value] : []
  }
  // 일반 장바구니 주문
  return cartData.value.items
    .filter((i) => i.isSelected)
    .map((i) => ({
      ...i,
      totalPrice: i.discountedPrice * i.quantity,
    }))
})

// 가격 계산
// 정가
const originalTotal = computed(() =>
  orderItems.value.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
)

// 배송비
const shippingTotal = computed(() => orderItems.value.reduce((sum, i) => sum + i.shippingPrice, 0))

// 할인가
const discountTotal = computed(
  () => originalTotal.value - orderItems.value.reduce((sum, i) => sum + i.totalPrice, 0),
)

// 할인가 + 배송비
const orderTotal = computed(
  () => orderItems.value.reduce((sum, i) => sum + i.totalPrice, 0) + shippingTotal.value,
)
</script>
