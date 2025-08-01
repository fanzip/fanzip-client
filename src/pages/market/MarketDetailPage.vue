<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import api from '@/api'

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

const userApi = {
  getUserInfo: async () => {
    const res = await api.get('/api/user') // 헤더에 jwt 보내는 요청
    return res
  },
}

// 상품 상세 사진 자동 넘김
onMounted(async () => {
  try {
    const { data } = await api.get(`/api/market/products/${productId}`)
    product.value = data

    if (product.value.detailImagesList.length) {
      setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % product.value.detailImagesList.length
      }, 2000)
    }
  } catch (e) {
    console.error('상품 상세 조회 실패', e)
  }
})

function formatOpenTime(iso) {
  const d = new Date(iso)
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${d.getFullYear()}년 ${MM}월 ${dd}일 ${hh}시 ${mi}분`
}

async function addToCart() {
  try {
    await api.post(`/api/cart`, {
      productId: Number(productId),
      quantity: 1,
    })
    cartAdded.value = true
  } catch (err) {
    console.error('장바구니 담기 실패', err)
  }
}

function goToCart() {
  router.push({ name: 'CartPage' })
}

function goToPurchase() {
  router.push({ name: 'PurchasePage', params: { productId } })
}
</script>

<template>
  <!-- 헤더 -->
  <AppHeader type="back-icons" />

  <!-- 품절 & 오픈전 오버레이-->
  <!-- <div class="relative"> -->
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
  </div>
  <!-- </div> -->
</template>
