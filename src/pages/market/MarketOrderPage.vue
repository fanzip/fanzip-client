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

  <!-- 6. 결제 네비게이션 바 -->
  <nav
    class="fixed bottom-0 left-0 w-full h-20 bg-base-bg border-t border-nav-stroke rounded-t-2xl flex items-center justify-center z-50"
  >
    <BaseButton
      :variant="selectedPayment !== null && !isProcessing ? 'primary' : 'cancel'"
      size="lg"
      :disabled="selectedPayment === null || isProcessing"
      @click="selectedPayment !== null && !isProcessing && createOrder()"
    >
      <span v-if="isProcessing">처리중...</span>
      <template v-else>
        <span class="font-extrabold">{{ orderTotal.toLocaleString() }}원</span>
        <span class="font-semibold">결제하기</span>
      </template>
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

const cartData = ref({
  items: [],
  grandTotal: 0,
  address1: '',
  address2: '',
  name: '',
  phone: '',
  zipcode: '',
})

// 바로 구매용 임시 product
const buyItem = ref(null)
const isProcessing = ref(false)

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
      influencerId: prod.influencerId,
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

// 총 배송비
const shippingTotal = computed(() => orderItems.value.reduce((sum, i) => sum + i.shippingPrice, 0))

// 총 할인가
const discountTotal = computed(
  () => originalTotal.value - orderItems.value.reduce((sum, i) => sum + i.totalPrice, 0),
)

// 할인가 + 배송비
const orderTotal = computed(
  () => orderItems.value.reduce((sum, i) => sum + i.totalPrice, 0) + shippingTotal.value,
)

// 결제 방법 선택
const selectedPayment = ref(null)

async function createOrder() {
  if (!selectedPayment.value || isProcessing.value) return

  try {
    isProcessing.value = true

    // BE로 전달할 데이터
    const orderData = {
      finalAmount: orderTotal.value,
      recipientName: cartData.value.name,
      recipientPhone: cartData.value.phone,
      shippingAddress1: cartData.value.address1,
      shippingAddress2: cartData.value.address2,
      zipcode: cartData.value.zipcode,
      paymentMethod: selectedPayment.value || 'TOSSPAY',
      orderType: route.query.type === 'buy' ? 'buy' : 'cart',
      items: orderItems.value.map((item) => ({
        productId: item.productId,
        influencerId: item.influencerId,
        quantity: item.quantity,
        unitPrice: item.discountedPrice,
        shippingPrice: item.shippingPrice,
        finalPrice: item.discountedPrice * item.quantity,
        cartItemId: route.query.type === 'cart' ? item.cartItemId : null,
      })),
    }

    const response = await marketApi.createOrder(orderData)
    console.log('주문 생성 완료: ', response)

    router.push({
      name: 'PaymentPage',
      query: { paymentType: 'ORDER', orderId: response.orderId, amount: orderTotal.value },
    })
  } catch (e) {
    console.error('주문 생성 실패: ', e)
    alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요')
  } finally {
    isProcessing.value = false
  }
}
</script>
