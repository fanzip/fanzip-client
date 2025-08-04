<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import marketApi from '@/api/marketApi'

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.productId

const product = ref({
  productId: 0,
  influencerId: 0,
  name: '',
  stock: 0,
  price: 0,
  discountedPrice: 0,
  discountRate: 0,
  shippingPrice: 0,
  description: '',
  thumbnailImage: '',
  detailImages: '',
  descriptionImages: '',
  detailImagesList: [],
  descriptionImagesList: [],
  gradeId: 0,
  openTime: '',
  options: null,
  available: true,
})

const cartAdded = ref(false)
const currentSlide = ref(0)

onMounted(async () => {
  try {
    const data = await marketApi.getProductDetail(productId)
    product.value = data

    // 상품 사진 자동 넘김
    if (product.value.detailImagesList.length) {
      setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % product.value.detailImagesList.length
      }, 2000)
    }
  } catch (e) {
    console.error('상품 상세 조회 실패', e)
  }
})

// 시간 데이터 형식
function formatOpenTime(iso) {
  const d = new Date(iso)
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${d.getFullYear()}년 ${MM}월 ${dd}일 ${hh}:${mi}:${ss}`
}

// 등급 얻기
function getGradeName(g) {
  switch (g) {
    case 1:
      return 'White'
    case 2:
      return 'Silver'
    case 3:
      return 'Gold'
    case 4:
      return 'Vip'
    default:
      return '일반'
  }
}

// 장바구니 담기
async function addToCart() {
  try {
    await marketApi.addToCart({ productId: productId, quantity: 1 })
    cartAdded.value = true

    setTimeout(() => {
      cartAdded.value = false
    }, 3000)
  } catch (e) {
    console.error('장바구니 담기 실패', e)
  }
}

// 장바구니로 이동
function goToCart() {
  router.push({ name: 'cart' })
}

// **** 구매 프로세스로 이동 (추후에 수정)
function goToPurchase() {
  router.push({ name: 'market-order', params: { productId } })
}
</script>

<template>
  <!-- 헤더 -->
  <AppHeader type="back-icons" />

  <!-- 품절 & 오픈전 오버레이-->
  <div
    v-if="product.stock === 0 || !product.available"
    class="fixed top-12 left-0 right-0 bottom-0 bg-black bg-opacity-30 z-10 pointer-events-none"
  ></div>

  <!-- 슬라이드 이미지 -->
  <div class="w-full aspect-square overflow-hidden relative">
    <img
      :src="product.detailImagesList[currentSlide]"
      class="w-full h-full object-cover transition-all duration-500"
      alt="상세사진 - 슬라이드"
    />
  </div>

  <!-- 상품 정보 -->
  <div class="ml-5 mr-5 space-y-2">
    <!-- 상품명 -->
    <p class="text-xl font-medium">{{ product.name }}</p>

    <!-- 할인율 + 할인전가격-->
    <div class="flex space-x-2">
      <div class="text-xl font-bold text-subtle-text">
        {{ Math.round(product.discountRate * 100) }}%
      </div>
      <div class="font-medium line-through text-xl text-subtle-border">{{ product.price }}원</div>
    </div>

    <!-- 할인가 + 배송비 -->
    <div class="flex items-center justify-between">
      <div class="flex items-end space-x-2">
        <div class="text-2xl font-extrabold text-text-emphasis">
          {{ product.discountedPrice }}원
        </div>
        <div class="text-base font-semibold text-text-emphasis">나의 할인가</div>
      </div>

      <div class="text-base font-semibold text-subtle-text flex justify-end space-x-2 items-end">
        <img src="@/assets/market/BsTruck.svg" alt="Truck logo" />
        <span v-if="product.shippingPrice === 0">무료배송</span>
        <span v-else>{{ product.shippingPrice.toLocaleString() }}원</span>
      </div>
    </div>

    <!-- 구분선 -->
    <div>
      <hr class="border-t border-nav-deactivated w-full mt-6" />
    </div>

    <!-- 설명 이미지 -->
    <div class="mt-4 space-y-4">
      <img
        v-for="(img, i) in product.descriptionImagesList"
        :key="i"
        :src="img"
        class="w-full rounded-lg"
        alt="description"
      />
    </div>

    <!-- 1. 품절인 경우 -->
    <div v-if="product.stock === 0">
      <nav
        class="fixed bottom-0 left-0 w-full h-20 bg-base-bg border-t border-nav-stroke rounded-t-2xl flex items-center justify-center z-50"
      >
        <div
          class="w-[353px] h-12 bg-subtle-border rounded-xl font-bold text-base flex items-center justify-center"
        >
          품절
        </div>
      </nav>
    </div>

    <!-- 2. 오픈 시간이 안된 경우 -->
    <div v-else-if="!product.available">
      <nav
        class="fixed bottom-0 left-0 w-full h-28 bg-base-bg border-t border-nav-stroke rounded-t-2xl flex items-center justify-center z-50"
      >
        <div
          class="w-full h-16 ml-5 mr-5 bg-subtle-border rounded-xl text-base flex flex-col items-center justify-center text-center leading-none font-semibold"
        >
          <span>
            <span class="font-extrabold">{{ getGradeName(product.gradeId) }}</span> 등급의 오픈
            시간은
          </span>
          <span>
            <span class="font-extrabold">{{ formatOpenTime(product.openTime) }}</span> 입니다.
          </span>
        </div>
      </nav>
    </div>

    <!-- 3. 정상 -->
    <div v-else>
      <nav
        class="fixed bottom-0 left-0 w-full h-20 bg-base-bg border-t border-nav-stroke rounded-t-2xl flex items-center justify-center z-50"
      >
        <!-- 3-1. 장바구니 담기 전  -->
        <div v-if="!cartAdded" class="flex gap-4 items-center">
          <BaseButton variant="cart" size="md" @click="addToCart">
            <img src="@/assets/button/shopping-bag.svg" alt="장바구니" class="w-5 h-5" />
            장바구니 담기
          </BaseButton>
          <BaseButton variant="buy" size="md" @click="goToPurchase">바로 구매하기</BaseButton>
        </div>

        <!-- 3-2. 장바구니 담은 후 -->
        <div v-else class="flex justify-between items-center px-6 w-full">
          <div class="flex items-center gap-1">
            <img src="@/assets/market/shoppingBagGrey.svg" alt="장바구니2" class="w-5 h-5" />
            <span class="text-base font-bold"> 장바구니에 상품을 담았습니다 </span>
          </div>

          <button
            @click="goToCart"
            class="flex items-center gap-0 text-subtle-text text-base font-medium"
          >
            <span>바로가기</span>
            <img src="@/assets/market/chevron-down.svg" alt=">" />
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>
