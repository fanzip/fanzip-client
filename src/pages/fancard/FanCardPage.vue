<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fancardApi } from '@/api/fancardApi'

const router = useRouter()

const srcList = [
  new URL('@/assets/fancard/CalmDownMan.svg', import.meta.url).href,
  new URL('@/assets/fancard/CharlesEnter.svg', import.meta.url).href,
  new URL('@/assets/fancard/TaeHa.svg', import.meta.url).href,
  new URL('@/assets/fancard/TomoTomo.svg', import.meta.url).href,
  new URL('@/assets/fancard/YeoDanO.svg', import.meta.url).href,
]

const cards = ref([])
const isLoading = ref(false)
const error = ref(null)

const activeIndex = ref(0)

const visibleCards = computed(() => {
  const range = 2
  const total = cards.value.length
  const result = []

  for (let i = -range; i <= range; i++) {
    const realIndex = (activeIndex.value + i + total) % total
    result.push({ card: cards.value[realIndex], realIndex })
  }

  return result
})

const handleCardClick = (realIndex) => {
  if (realIndex !== activeIndex.value) {
    activeIndex.value = realIndex
    return
  }
  const card = cards.value[realIndex]
  router.push({ name: 'FanCardDetailPage', params: { id: String(card.cardId) } })
}

let scrollCooldown = false

const onScroll = (e) => {
  if (scrollCooldown) return
  scrollCooldown = true

  activeIndex.value =
    e.deltaY > 0
      ? (activeIndex.value + 1) % cards.value.length
      : (activeIndex.value - 1 + cards.value.length) % cards.value.length

  setTimeout(() => {
    scrollCooldown = false
  }, 150)
}

let startY = 0
let dragging = false

const startDrag = (e) => {
  dragging = true
  startY = e.touches ? e.touches[0].clientY : e.clientY
}

const onDrag = (e) => {
  if (!dragging) return
  const currentY = e.touches ? e.touches[0].clientY : e.clientY
  const diffY = currentY - startY

  if (Math.abs(diffY) > 50) {
    activeIndex.value =
      diffY > 0
        ? (activeIndex.value - 1 + cards.value.length) % cards.value.length
        : (activeIndex.value + 1) % cards.value.length
    startY = currentY
  }
}

const endDrag = () => {
  dragging = false
}

const getCardStyle = (cardIndex) => {
  const total = cards.value.length
  let offset = cardIndex - activeIndex.value

  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total

  let translateY, scale, opacity, boxShadow

  if (offset === 0) {
    translateY = 0
    scale = 1
    opacity = 1
    boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)'
  } else if (Math.abs(offset) === 1) {
    translateY = offset > 0 ? 120 : -120
    scale = 0.85
    opacity = 0.6
    boxShadow = '0 5px 10px rgba(0,0,0,0.05)'
  } else {
    translateY = offset > 0 ? 200 : -200
    scale = 0.7
    opacity = 0.3
    boxShadow = 'none'
  }

  const zIndex = 100 - Math.abs(offset)

  return {
    transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
    opacity,
    zIndex,
    boxShadow,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.6s ease',
    cursor: 'pointer',
  }
}

const fetchFancards = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await fancardApi.getUserFancards()
    const fancardData = response.data.fancards || []

    cards.value = fancardData.map((fancard, index) => ({
      cardId: fancard.cardId,
      name: fancard.influencerName,
      src: fancard.cardDesignUrl || srcList[index % srcList.length],
      grade: fancard.membershipGrade?.gradeName || 'White',
      cardNumber: fancard.cardNumber,
      influencerId: fancard.influencerId,
      category: fancard.category,
    }))
  } catch (err) {
    console.error('팬카드 목록 조회 실패:', err)
    error.value = '팬카드를 불러오는데 실패했습니다.'

    cards.value = Array.from({ length: 5 }, (_, i) => ({
      cardId: i + 1,
      name: `Card${i + 1}`,
      src: srcList[i % srcList.length],
      grade: ['VIP', 'Gold', 'Silver', 'White'][i % 4],
    }))
  } finally {
    isLoading.value = false
  }
}

const getBadgeClass = (grade) => {
  switch (grade) {
    case 'VIP':
      return 'badge badge-vip'
    case 'Gold':
      return 'badge badge-gold'
    case 'Silver':
      return 'badge badge-silver'
    case 'White':
      return 'badge badge-white'
    default:
      return 'badge'
  }
}

onMounted(() => {
  fetchFancards()
})
</script>

<template>
  <div class="min-h-screen bg-[#f3f4f6]">
    <header>
      <AppHeader type="logo" />
    </header>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex items-center justify-center mt-40">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center mt-40 px-5">
      <p class="text-text-emphasis text-center mb-4">{{ error }}</p>
      <button
        @click="fetchFancards"
        class="px-4 py-2 bg-brand-primary text-black rounded-lg hover:bg-brand-accent"
      >
        다시 시도
      </button>
    </div>

    <!-- 팬카드가 없는 경우 -->
    <div
      v-else-if="cards.length === 0"
      class="flex flex-col items-center justify-center mt-40 px-5"
    >
      <p class="text-subtle-text text-center">보유한 팬카드가 없습니다.</p>
    </div>

    <!-- 팬카드 목록 -->
    <div
      v-else
      class="relative w-full h-[60vh] max-w-xs md:max-w-sm mx-auto mt-28 touch-pan-y select-none"
      @wheel="onScroll"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
    >
      <div
        v-for="{ card, realIndex } in visibleCards"
        :key="card.cardId"
        class="absolute top-1/2 left-1/2 w-80 h-45 bg-white rounded-xl overflow-hidden cursor-pointer"
        :style="getCardStyle(realIndex)"
        @click="handleCardClick(realIndex)"
      >
        <img :src="card.src" :alt="card.name" class="w-full h-full object-cover fancard-image" />
        <div class="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow">
          {{ card.name }}
        </div>
        <span
          class="absolute top-2 right-2 w-20 h-6 text-base font-bold flex items-center justify-center rounded-full"
          :class="getBadgeClass(card.grade)"
        >
          {{ card.grade }}
        </span>
      </div>
    </div>
    <app-nav />
  </div>
</template>

<style scoped>
.fancard-image {
  /* 이미지 기본 표시 */
}
</style>
