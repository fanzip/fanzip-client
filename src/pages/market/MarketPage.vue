<script setup>
import SearchBar from '@/components/common/SearchBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ProductsList from '@/components/market/ProductsList.vue'

import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import ScrollToTop from '@/components/market/ScrollToTop.vue'
import AppNav from '@/components/layout/AppNav.vue'

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
  } catch (e) {
    console.error('상품 조회 실패', e)
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

// 무한 스크롤 설정
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
  <AppNav />
</template>
