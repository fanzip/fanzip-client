<script setup>
import SearchBar from '@/components/market/MarketSearchBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ProductsList from '@/components/market/ProductsList.vue'

import { ref, watch, onMounted, onUnmounted } from 'vue'
import ScrollToTop from '@/components/market/ScrollToTop.vue'
import AppNav from '@/components/layout/AppNav.vue'
import marketApi from '@/api/marketApi'
import userApi from '@/api/userApi'

const keyword = ref('')
const products = ref([])
const lastProductId = ref(null)
const isLoading = ref(false)
const hasMore = ref(true)

const recommendedTop = ref([]) // 상단 추천 상품
const userName = ref('')

// 자동 스크롤 관련
const scrollContainer = ref(null)
const autoScrollInterval = ref(null)
const duplicatedItems = ref([])

const fetchUserName = async () => {
  try {
    const res = await userApi.getUserInfo()
    userName.value = res?.data?.name || ''
  } catch (e) {
    console.error('유저 정보 조회 실패', e)
    userName.value = ''
  }
}

const fetchTopRecommended = async () => {
  try {
    const data = await marketApi.getProducts({
      limit: 20,
      onlySubscribed: true,
      sort: 'latest',
    })
    recommendedTop.value = Array.isArray(data) ? data : []
    // 무한 스크롤을 위해 아이템들을 복제
    if (recommendedTop.value.length > 0) {
      duplicatedItems.value = [...recommendedTop.value, ...recommendedTop.value]
    }
  } catch (e) {
    console.error('상단 추천상품 조회 실패', e)
    recommendedTop.value = []
    duplicatedItems.value = []
  }
}

const categoryKorean = [
  { ko: '전체', code: null },
  { ko: '의류', code: 'APPAREL' },
  { ko: '뷰티', code: 'BEAUTY' },
  { ko: '식품', code: 'FOOD' },
  { ko: '유아', code: 'INFANT' },
  { ko: '반려동물', code: 'PETS' },
  { ko: '가전', code: 'ELECTRONICS' },
  { ko: '가구', code: 'FURNITURE' },
  { ko: '인테리어', code: 'INTERIOR' },
  { ko: '주방', code: 'KITCHEN' },
  { ko: '스포츠/레저', code: 'SPORTS_LEISURE' },
  { ko: '자동차', code: 'AUTOMOTIVE' },
  { ko: '생활', code: 'LIFESTYLE' },
  { ko: '악기', code: 'MUSICAL_INSTRUMENTS' },
  { ko: '여행', code: 'TRAVEL' },
  { ko: '기타', code: 'OTHER' },
]
const selectedCategory = ref(categoryKorean[0]) // 전체

const sortMode = ref('recommended')

// 다음 페이지 fetch
const fetchProducts = async () => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  try {
    const data = await marketApi.getProducts({
      limit: 20,
      keyword: keyword.value,
      lastProductId: lastProductId.value,
      sort: sortMode.value,
      category: selectedCategory.value.code,
    })

    if (data.length < 20) hasMore.value = false
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

// 검색/카테고리/정렬 변경시 초기화
const resetAndFetch = () => {
  products.value = []
  lastProductId.value = null
  hasMore.value = true
  fetchProducts()
}

// 검색/카테고리/정렬 초기화
watch(keyword, resetAndFetch)
watch(selectedCategory, resetAndFetch)
watch(sortMode, resetAndFetch)

// 자동 스크롤
const startAutoScroll = () => {
  if (!scrollContainer.value || duplicatedItems.value.length === 0) return

  autoScrollInterval.value = setInterval(() => {
    const container = scrollContainer.value
    const itemWidth = 152
    const scrollAmount = 1

    container.scrollLeft += scrollAmount

    const maxScrollLeft = recommendedTop.value.length * itemWidth
    if (container.scrollLeft >= maxScrollLeft) {
      container.scrollLeft = 0
    }
  }, 20)
}

// 자동 스크롤 정지
const stopAutoScroll = () => {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value)
    autoScrollInterval.value = null
  }
}

// 무한 스크롤
const sentinel = ref(null)
let observer
onMounted(() => {
  fetchTopRecommended()
  fetchUserName()
  fetchProducts()
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) fetchProducts()
    },
    { rootMargin: '200px' },
  )
  if (sentinel.value) observer.observe(sentinel.value)

  // 추천 상품이 로드된 후 자동 스크롤 시작
  setTimeout(() => {
    startAutoScroll()
  }, 1000)
})

onUnmounted(() => {
  stopAutoScroll()
  if (observer) observer.disconnect()
})
</script>

<template>
  <!-- 헤더 -->
  <AppHeader type="logo-icons" />

  <!-- 검색 -->
  <SearchBar class="pt-[68px]" v-model:keyword="keyword" />

  <div class="mb-5">
    <!-- 추천상품 가로 스크롤 -->
    <section v-if="recommendedTop.length" class="bg-subtle-bg rounded-lg m-5 p-4">
      <div class="flex items-center justify-between font-semibold text-xl pb-4">
        {{ userName ? `${userName}님의 추천상품` : '추천상품' }}
      </div>

      <div
        ref="scrollContainer"
        class="flex gap-3 overflow-x-auto no-scrollbar pb-1"
        @mouseenter="stopAutoScroll"
        @mouseleave="startAutoScroll"
        @touchstart="stopAutoScroll"
        @touchend="startAutoScroll"
      >
        <div
          v-for="(r, index) in duplicatedItems"
          :key="`${r.productId}-${index}`"
          class="shrink-0 w-[140px] rounded-xl bg-white p-2"
          @click="$router.push(`/market/${r.productId}`)"
        >
          <div class="w-[120px] h-[120px] mx-auto overflow-hidden rounded-xl">
            <img :src="r.thumbnailImage" :alt="r.name" class="w-full h-full object-cover" />
          </div>

          <p class="mt-2 px-2 text-sm font-normal line-clamp-2">
            {{ r.name }}
          </p>

          <p class="mt-1 px-2 text-base font-extrabold">
            {{ Number(r.discountedPrice).toLocaleString() }}원
          </p>
        </div>
      </div>
    </section>

    <!-- 카테고리 선택 -->
    <section class="mt-4 px-4">
      <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 whitespace-nowrap">
        <button
          v-for="c in categoryKorean"
          :key="c.ko"
          @click="selectedCategory = c"
          class="inline-flex items-center justify-center px-5 h-7 rounded-xl text-sm transition-all duration-200 ease-out active:scale-[0.98]"
          :class="
            selectedCategory.ko === c.ko
              ? 'bg-brand-primary text-text-inverse shadow-sm'
              : 'bg-subtle-bg text-black'
          "
        >
          {{ c.ko }}
        </button>
      </div>

      <!-- 정렬 탭 -->
      <div class="flex justify-end gap-4 mt-3 pr-5 text-xs">
        <button
          class="transition-colors"
          :class="sortMode === 'recommended' ? 'font-medium text-black' : 'text-nav-deactivated'"
          @click="sortMode = 'recommended'"
        >
          추천순
        </button>
        <button
          class="transition-colors"
          :class="sortMode === 'latest' ? 'font-medium text-black' : 'text-nav-deactivated'"
          @click="sortMode = 'latest'"
        >
          최신순
        </button>

        <button
          class="transition-colors"
          :class="sortMode === 'priceAsc' ? 'font-medium text-black' : 'text-nav-deactivated'"
          @click="sortMode = 'priceAsc'"
        >
          낮은가격순
        </button>
      </div>
    </section>

    <!-- 검색 결과 없는 경우 -->
    <div
      v-if="!isLoading && keyword && products.length === 0"
      class="flex flex-col items-center justify-center py-20 text-base"
    >
      <p class="text-base text-subtle-text">검색 결과가 없습니다</p>
    </div>

    <!-- 상품 리스트 -->
    <div class="grid grid-cols-2 gap-4 ml-5 mr-5 mt-3 mb-20">
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
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
