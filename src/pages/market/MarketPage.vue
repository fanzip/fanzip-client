<script setup>
import SearchBar from '@/components/common/SearchBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ProductsList from '@/components/market/ProductsList.vue'

import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import ScrollToTop from '@/components/market/ScrollToTop.vue'

const keyword = ref('')
const products = ref([])
const lastProductId = ref(null)
const isLoading = ref(false)
const hasMore = ref(true)

// 다음 페이지 fetch
const fetchProducts = async () => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  try {
    const params = { limit: 20 }
    if (keyword.value) params.q = keyword.value
    if (lastProductId.value) params.lastProductId = lastProductId.value

    const { data } = await axios.get('/api/market/products', { params })
    if (data.length < params.limit) {
      hasMore.value = false
    }
    products.value.push(...data)
    if (data.length) {
      lastProductId.value = data[data.length - 1].productId
    }
  } finally {
    isLoading.value = false
  }
}

// 검색어 초기화
watch(keyword, () => {
  products.value = []
  lastProductId.value = null
  hasMore.value = true
  fetchProducts()
})

// 무한 스크롤 observer
const sentinel = ref(null)
let observer
onMounted(() => {
  fetchProducts()
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) fetchProducts()
    },
    { rootMargin: '200px' },
  )
  if (sentinel.value) observer.observe(sentinel.value)
})
// const products = ref([
//   {
//     productId: 1,
//     name: '[침착맨] 침바오 음성 인형 응애~',
//     price: 20000,
//     discountedPrice: 16000,
//     discountedRate: 0.25,
//     thumbnailImage:
//       'https://shop-phinf.pstatic.net/20240731_160/1722385484288CVPGq_PNG/10278980372854391_1289295091.png?type=m510',
//     stock: 100,
//   },
//   {
//     productId: 2,
//     name: '[침착맨] 빵애빵애빵애빵애빵애빵애빵애에요 음성 인형',
//     price: 20000,
//     discountedPrice: 10000,
//     discountedRate: 0.5,
//     thumbnailImage:
//       'https://shop-phinf.pstatic.net/20241227_115/1735266453049wJB46_PNG/50274947065748712_1358927972.png?type=m510',
//     stock: 200,
//   },
//   {
//     productId: 3,
//     name: '[침착맨] 레몬맨 스트레스 볼 스트레스 팡팡',
//     price: 10000,
//     discountedPrice: 7000,
//     discountedRate: 0.3,
//     thumbnailImage:
//       'https://shop-phinf.pstatic.net/20240731_300/1722385486773gcY6V_PNG/1972590600709110_1542956351.png?type=m510',
//     stock: 300,
//   },
//   {
//     productId: 4,
//     name: '[여단오] 신비 복숭아 신비해요 아주 맛있어요',
//     price: 10000,
//     discountedPrice: 8000,
//     discountedRate: 0.2,
//     thumbnailImage:
//       'https://shop-phinf.pstatic.net/20250724_28/1753346225331zcU9K_PNG/21865549438298396_377767455.png?type=m510',
//     stock: 400,
//   },
//   {
//     productId: 5,
//     name: '[침착맨] 침바오 음성 인형 응애~',
//     price: 20000,
//     discountedPrice: 16000,
//     discountedRate: 0.25,
//     thumbnailImage:
//       'https://shop-phinf.pstatic.net/20240731_160/1722385484288CVPGq_PNG/10278980372854391_1289295091.png?type=m510',
//     stock: 100,
//   },
//   {
//     productId: 6,
//     name: '[침착맨] 빵애빵애빵애빵애빵애빵애빵애에요 음성 인형',
//     price: 20000,
//     discountedPrice: 10000,
//     discountedRate: 0.5,
//     thumbnailImage:
//       'https://shop-phinf.pstatic.net/20241227_115/1735266453049wJB46_PNG/50274947065748712_1358927972.png?type=m510',
//     stock: 200,
//   },
// ])
</script>

<template>
  <!-- 헤더 -->
  <AppHeader type="logo" />

  <!-- 검색 -->
  <SearchBar v-model:keyword="keyword" />

  <div class="mb-20">
    <!-- 검색 결과 없는 경우 -->
    <div
      v-if="!isLoading && keyword && products.length === 0"
      class="flex flex-col items-center justify-center py-20 text-base"
    >
      <p class="text-base">검색 결과가 없습니다</p>
    </div>

    <!-- 상품 리스트 -->
    <div class="grid grid-cols-2 gap-4 ml-5 mr-5">
      <ProductsList v-for="item in products" :key="item.productId" :item="item" />
    </div>

    <!-- 다음 페이지 로드 -->
    <div ref="sentinel" class="h-1"></div>

    <div v-if="isLoading" class="text-center py-4">Loading...</div>
    <div v-else-if="!hasMore && !keyword" class="text-center py-4 text-subtle-text">
      상품이 없습니다
    </div>
    <ScrollToTop />
  </div>
</template>
