<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fancardApi } from '@/api/fancardApi'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// 이미지 로드 실패 시 fallback 처리

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
  router.push({ name: 'FanCardDetailPage', params: { id: String(card.cardId || card.id) } })
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

const handleImageError = (event, card) => {
  console.error('=== IMAGE LOAD ERROR ===')
  console.error('Failed to load image:', card.src)
  console.error('Card info:', card)
  console.error('Event:', event)

  // 이미지 로드 실패 시 오류 상태로 변경
  const targetCard = cards.value.find((c) => c.cardId === card.cardId)
  if (targetCard) {
    targetCard.hasError = true
    console.log(`Set hasError=true for card ${card.cardId}`)
  }
  event.target.style.display = 'none' // 실패한 이미지 숨김
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
    translateY = offset > 0 ? 100 : -100 // 120 → 100 (20px 줄임)
    scale = 0.85
    opacity = 0.6
    boxShadow = '0 5px 10px rgba(0,0,0,0.05)'
  } else {
    translateY = offset > 0 ? 180 : -180 // 200 → 180 (20px 줄임)
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

    // 개발 환경에서 토큰이 없는 경우 테스트 토큰 설정 (user_id: 8 for 하경한)
    if (import.meta.env.DEV && !authStore.token) {
      console.warn('개발 환경: 테스트 JWT 토큰 설정 (user_id: 8)')
      const testToken =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBQ0NFU1NfVE9LRU4iLCJ1c2VySWQiOjgsImlhdCI6MTc1NDUzMjYxMSwiZXhwIjoxNzU0NTM0NDExfQ.nkTxBnNSQtR-gojKR89QV4hCQ9xNAZAWDMYyKuIrMdU'
      authStore.setToken(testToken)
    }

    const response = await fancardApi.getUserFancards()
    const fancardData = response.data.fancards || []

    console.log('=== FANCARD API RESPONSE DEBUG ===')
    console.log('Full response:', response.data)
    console.log('Fancards array:', fancardData)

    cards.value = fancardData.map((fancard) => {
      console.log(`Fancard ${fancard.cardId}:`, {
        name: fancard.influencerName,
        imageUrl: fancard.cardDesignUrl,
        grade: fancard.membershipGrade?.gradeName,
      })

      return {
        cardId: fancard.cardId,
        name: fancard.influencerName,
        src: fancard.cardDesignUrl, // MySQL에서 받은 URL 그대로 사용
        grade: fancard.membershipGrade?.gradeName || 'White',
        cardNumber: fancard.cardNumber,
        influencerId: fancard.influencerId,
        category: fancard.category,
        hasError: false, // 이미지 로드 에러 상태
      }
    })
  } catch (err) {
    console.error('팬카드 목록 조회 실패:', err)

    if (err.response?.status === 401) {
      error.value = '로그인이 필요합니다.'
      // 로그인 페이지로 이동하거나 토큰 갱신 시도
      if (!import.meta.env.DEV) {
        router.push('/login')
        return
      }
    } else if (err.response?.status === 404) {
      error.value = '팬카드 데이터를 찾을 수 없습니다.'
    } else if (err.code === 'ECONNABORTED') {
      error.value = '서버 응답 시간이 초과되었습니다.'
    } else {
      error.value = '팬카드를 불러오는데 실패했습니다.'
    }

    // Mock 데이터 완전 제거 - MySQL에서만 데이터 받아옴
    // 에러 시 빈 배열 유지하여 "보유한 팬카드가 없습니다" 메시지 표시
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

onMounted(() => {
  fetchFancards()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#f3f4f6]">
    <header class="flex-shrink-0">
      <AppHeader type="logo" />
    </header>

    <!-- 메인 컨텐츠 영역: 헤더와 네비게이션 사이의 공간 활용 -->
    <main class="flex-1 flex items-center justify-center pt-[100px] pb-[108px]">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="flex flex-col items-center justify-center px-5">
        <p class="text-text-emphasis text-center mb-4">{{ error }}</p>
        <button
          @click="fetchFancards"
          class="px-4 py-2 bg-brand-primary text-black rounded-lg hover:bg-brand-accent"
        >
          다시 시도
        </button>
      </div>

      <!-- 팬카드가 없는 경우 -->
      <div v-else-if="cards.length === 0" class="flex flex-col items-center justify-center px-5">
        <p class="text-subtle-text text-center">보유한 팬카드가 없습니다.</p>
      </div>

      <!-- 팬카드 목록 (카드 회전 애니메이션) -->
      <div
        v-else
        class="relative w-full max-w-xs md:max-w-sm mx-auto touch-pan-y select-none mb-[28px]"
        style="height: min(60vh, 480px)"
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
          :key="card.cardId || card.id || card.name"
          class="absolute top-1/2 left-1/2 w-80 h-45 bg-white rounded-xl overflow-hidden cursor-pointer"
          :style="getCardStyle(realIndex)"
          @click="handleCardClick(realIndex)"
        >
          <img
            v-if="!card.hasError && card.src"
            :src="card.src"
            :alt="card.name"
            class="w-full h-full fancard-image"
            @error="handleImageError($event, card)"
          />
          <!-- 이미지 로드 실패 시 표시할 fallback -->
          <div
            v-else
            class="bg-gray-200 flex items-center justify-center text-gray-500 text-sm fancard-fallback"
            style="
              width: 20rem;
              height: 11.25rem;
              position: absolute;
              top: 0;
              left: 0;
              transform: scale(1.1);
            "
          >
            이미지를 불러올 수 없습니다
          </div>
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
    </main>

    <app-nav />
  </div>
</template>

<style scoped>
.fancard-image {
  /* 이미지가 카드를 완전히 꽉 채우도록 강제 설정 */
  object-fit: none !important;
  object-position: center;
  width: 100% !important;
  height: 100% !important;
  transform: scale(1.1);
}

.fancard-fallback {
  /* fallback div도 이미지와 동일한 크기와 스케일 적용 */
  width: 20rem !important; /* w-80 = 20rem */
  height: 11.25rem !important; /* h-45 = 11.25rem */
  transform: scale(1.1);
}
</style>
