<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = route.params.productId

const product = ref({
  name: '[침착맨] 침바오 음성 인형 응애~응애~응애~응애~응애~응애~응애~응애~응애~응애~응애~',
  price: 20000,
  discountedPrice: 16000,
  discountedRate: 0.25,
  thumbnailImage:
    'https://shop-phinf.pstatic.net/20240731_160/1722385484288CVPGq_PNG/10278980372854391_1289295091.png?type=m510',
  stock: 100,
  influencerId: 1,
  shippingPrice: 0,
  description: '침바오 설명',
  gradeId: 2,
  openTime: '2025-07-06 09:00:00',
  options: null,
  available: true,
  detailImages:
    '["https://shop-phinf.pstatic.net/20240731_160/1722385484288CVPGq_PNG/10278980372854391_1289295091.png?type=m510","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpOFZn8FUCBqJ19frRvcVadaXxBB7FOJ4-xw&s"]',
  descriptionImages:
    '["https://shop-phinf.pstatic.net/20241218_79/1734515629712mHYu2_JPEG/%EC%B9%A8%EC%B0%A9%EB%A7%A8_%EC%B9%A8%EB%B0%94%EC%98%A4_%EC%9D%8C%EC%84%B1%EC%9D%B8%ED%98%95_%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80_%ED%8F%BC-01_(1).jpg?type=w860","https://shop-phinf.pstatic.net/20241218_45/1734515689050j2NQ9_JPEG/%EC%B9%A8%EC%B0%A9%EB%A7%A8_%EC%B9%A8%EB%B0%94%EC%98%A4_%EC%9D%8C%EC%84%B1%EC%9D%B8%ED%98%95_%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80_%ED%8F%BC-02_(1).jpg?type=w860"]',
  detailImagesList: [
    'https://shop-phinf.pstatic.net/20240731_160/1722385484288CVPGq_PNG/10278980372854391_1289295091.png?type=m510',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpOFZn8FUCBqJ19frRvcVadaXxBB7FOJ4-xw&s',
  ],
  descriptionImagesList: [
    'https://shop-phinf.pstatic.net/20241218_79/1734515629712mHYu2_JPEG/%EC%B9%A8%EC%B0%A9%EB%A7%A8_%EC%B9%A8%EB%B0%94%EC%98%A4_%EC%9D%8C%EC%84%B1%EC%9D%B8%ED%98%95_%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80_%ED%8F%BC-01_(1).jpg?type=w860',
    'https://shop-phinf.pstatic.net/20241218_45/1734515689050j2NQ9_JPEG/%EC%B9%A8%EC%B0%A9%EB%A7%A8_%EC%B9%A8%EB%B0%94%EC%98%A4_%EC%9D%8C%EC%84%B1%EC%9D%B8%ED%98%95_%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80_%ED%8F%BC-02_(1).jpg?type=w860',
  ],
})

const currentSlide = ref(0)

onMounted(() => {
  console.log('productId: ', productId)
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % product.value.detailImagesList.length
  }, 2000)
})
</script>

<template>
  <!-- 헤더 -->
  <AppHeader type="back-icons" />

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
        {{ Math.round(product.discountedRate * 100) }}%
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
</template>
