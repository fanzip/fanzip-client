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

// Filter state for active/inactive cards
const filterState = ref('all') // 'all', 'active'
const filteredCards = computed(() => {
  if (filterState.value === 'active') {
    return cards.value.filter((card) => card.isActive)
  }
  return cards.value
})

const visibleCards = computed(() => {
  const currentCards = filteredCards.value
  const total = currentCards.length
  if (total === 0) return []

  // 활성 인덱스가 필터된 카드 범위를 벗어나면 조정
  if (activeIndex.value >= total) {
    activeIndex.value = Math.max(0, total - 1)
  }

  // 카드 개수에 따른 동적 range 설정
  const maxRange = Math.min(2, Math.floor(total / 2))
  const range = total < 5 ? Math.floor(total / 2) : maxRange
  const result = []

  // 5장 미만일 때는 중복 렌더링 방지
  if (total < 5) {
    for (let i = 0; i < total; i++) {
      result.push({ card: currentCards[i], realIndex: i })
    }
    return result
  }

  // 5장 이상일 때는 기존 로직 사용
  for (let i = -range; i <= range; i++) {
    const realIndex = (activeIndex.value + i + total) % total
    result.push({ card: currentCards[realIndex], realIndex })
  }

  return result
})

const handleCardClick = (realIndex) => {
  if (realIndex !== activeIndex.value) {
    activeIndex.value = realIndex
    return
  }

  const card = filteredCards.value[realIndex]
  if (!card) {
    console.error('카드를 찾을 수 없습니다:', realIndex)
    return
  }

  const cardId = card.cardId || card.id
  if (!cardId) {
    console.error('카드 ID가 없습니다:', card)
    alert('카드 정보에 오류가 있습니다.')
    return
  }

  console.log(`팬카드 ${cardId} 상세페이지로 이동`)
  router.push({ name: 'FanCardDetailPage', params: { id: String(cardId) } })
}

// Filter change handler
const changeFilter = (newFilter) => {
  filterState.value = newFilter
  activeIndex.value = 0 // Reset to first card when filter changes
}

let scrollCooldown = false

const onScroll = (e) => {
  if (scrollCooldown) return
  scrollCooldown = true

  const total = filteredCards.value.length
  activeIndex.value =
    e.deltaY > 0 ? (activeIndex.value + 1) % total : (activeIndex.value - 1 + total) % total

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
    const total = filteredCards.value.length
    activeIndex.value =
      diffY > 0 ? (activeIndex.value - 1 + total) % total : (activeIndex.value + 1) % total
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

  // 5장 미만일 때는 단순 수직 스택 스타일 적용
  if (total < 5) {
    let translateY, scale, opacity, boxShadow, zIndex
    const distanceFromActive = Math.abs(cardIndex - activeIndex.value)

    if (cardIndex === activeIndex.value) {
      // 중앙 카드 (최고 z-index)
      translateY = 0
      scale = 1
      opacity = 1
      boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)'
      zIndex = 100
    } else if (distanceFromActive === 1) {
      // 인접 카드
      const isUp = cardIndex < activeIndex.value
      translateY = isUp ? -100 : 100
      scale = 0.9
      opacity = 0.8
      boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)'
      zIndex = 90
    } else {
      // 멀리 있는 카드
      const isUp = cardIndex < activeIndex.value
      translateY = isUp ? -170 : 170
      scale = 0.8
      opacity = 0.6
      boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
      zIndex = 80 - distanceFromActive
    }

    return {
      transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
      opacity,
      zIndex,
      boxShadow,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease',
      cursor: 'pointer',
    }
  }

  // 5장 이상일 때는 순환 로직 사용 (개선된 버전)
  let offset = cardIndex - activeIndex.value
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total

  let translateY, scale, opacity, boxShadow, zIndex

  if (offset === 0) {
    // 중앙 카드
    translateY = 0
    scale = 1
    opacity = 1
    boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)'
    zIndex = 100
  } else if (Math.abs(offset) === 1) {
    // 인접 카드 - 개선된 스택 순서
    translateY = offset > 0 ? 110 : -110
    scale = 0.88
    opacity = 0.75
    boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)'
    zIndex = offset > 0 ? 85 : 95 // 아래쪽 카드가 위쪽 카드보다 낮은 z-index
  } else {
    // 멀리 있는 카드 - 투명도 개선
    translateY = offset > 0 ? 200 : -200
    scale = 0.75
    opacity = 0.5 // 0.3에서 0.5로 높여서 덜 투명하게
    boxShadow = '0 3px 8px rgba(0, 0, 0, 0.05)'
    zIndex = offset > 0 ? 70 - Math.abs(offset) : 80 + offset // 자연스러운 스택
  }

  return {
    transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
    opacity,
    zIndex,
    boxShadow,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease',
    cursor: 'pointer',
  }
}

const fetchFancards = async () => {
  try {
    isLoading.value = true
    error.value = null

    // 개발 환경에서 토큰이 없는 경우 테스트 토큰 설정 (user_id: 7)
    if (import.meta.env.DEV && !authStore.token) {
      console.warn('개발 환경: 테스트 JWT 토큰 설정 (user_id: 7 - 3개 팬카드 보유)')
      // User ID 7용 JWT 토큰 - payload를 user_id 7으로 수정
      const testToken =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBQ0NFU1NfVE9LRU4iLCJ1c2VySWQiOjcsImlhdCI6MTc1NDUzMjYxMSwiZXhwIjoxNzU0NTM0NDExfQ.nkTxBnNSQtR-gojKR89QV4hCQ9xNAZAWDMYyKuIrMdU'
      authStore.setToken(testToken)
    }

    const response = await fancardApi.getUserFancards()
    const fancardData = response.data.fancards || []

    console.log('=== FANCARD API RESPONSE DEBUG ===')
    console.log('Full response:', response.data)
    console.log('Fancards array:', fancardData)

    const processedCards = fancardData
      .filter((fancard) => fancard.cardId)
      .map((fancard) => {
        console.log(`Fancard ${fancard.cardId}:`, {
          cardNumber: fancard.cardNumber,
          cardDesignUrl: fancard.cardDesignUrl,
          influencerName: fancard.influencerName,
        })

        // membershipGrade가 객체인 경우 gradeName 추출, 문자열인 경우 그대로 사용
        const grade =
          typeof fancard.membershipGrade === 'object' && fancard.membershipGrade
            ? fancard.membershipGrade.gradeName || 'White'
            : fancard.membershipGrade || 'White'

        return {
          cardId: fancard.cardId,
          name: fancard.influencerName || `카드 ${fancard.cardId}`,
          src: fancard.cardDesignUrl || `https://picsum.photos/320/180?random=${fancard.cardId}`, // fallback 이미지
          grade: grade,
          cardNumber: fancard.cardNumber,
          influencerId: fancard.influencerId,
          category: fancard.category,
          isActive: fancard.isActive !== undefined ? fancard.isActive : true, // 기본값은 true
          hasError: false,
        }
      })

    const uniqueCards = processedCards.reduce((acc, current) => {
      const existing = acc.find((item) => item.cardId === current.cardId)
      if (!existing) {
        acc.push(current)
      } else {
        console.warn(`중복 팬카드 제거됨: cardId ${current.cardId}`)
      }
      return acc
    }, [])

    cards.value = uniqueCards
    console.log(`=== 로드된 고유 팬카드: ${uniqueCards.length}개 ===`)
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

const getEmptyMessage = () => {
  if (filterState.value === 'active') {
    return '활성 팬카드가 없습니다.'
  }
  return '보유한 팬카드가 없습니다.'
}

const getFilterLabel = (filter) => {
  switch (filter) {
    case 'all':
      return '전체'
    case 'active':
      return '활성'
    default:
      return '전체'
  }
}

onMounted(() => {
  fetchFancards()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white">
    <header class="flex-shrink-0">
      <AppHeader type="logo" />
    </header>

    <!-- 메인 컨텐츠 영역: 헤더와 네비게이션 사이의 공간 활용 -->
    <main class="flex-1 flex flex-col pt-[100px] pb-[108px]">
      <!-- 메인 카드 영역 -->
      <div class="flex-1 flex items-center justify-center">
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
        <div
          v-else-if="filteredCards.length === 0"
          class="flex flex-col items-center justify-center px-5"
        >
          <p class="text-subtle-text text-center">{{ getEmptyMessage() }}</p>
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
            :key="`fancard-${realIndex}-${card.cardId || card.id || 'unknown'}`"
            class="absolute top-1/2 left-1/2 w-80 h-45 bg-white rounded-xl overflow-hidden cursor-pointer"
            :style="getCardStyle(realIndex)"
            @click="handleCardClick(realIndex)"
          >
            <!-- 비활성 카드 오버레이 -->
            <div
              v-if="!card.isActive"
              class="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center rounded-xl"
            >
              <div class="text-white text-center">
                <div class="text-sm font-semibold mb-1">구독 해지됨</div>
                <div class="text-xs opacity-80">탭하여 추억 보기</div>
              </div>
            </div>

            <img
              v-if="!card.hasError && card.src"
              :src="card.src"
              :alt="card.name"
              :class="{
                'w-full h-full fancard-image': true,
                'filter grayscale opacity-70': !card.isActive,
              }"
              @error="handleImageError($event, card)"
            />
            <!-- 이미지 로드 실패 시 표시할 fallback -->
            <div
              v-else
              class="bg-gray-200 flex items-center justify-center text-gray-500 text-sm fancard-fallback"
              :class="{ 'opacity-50': !card.isActive }"
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

            <div
              class="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow"
              :class="{ 'opacity-80': !card.isActive }"
            >
              {{ card.name }}
            </div>
            <span
              class="absolute top-2 right-2 w-20 h-6 text-base font-bold flex items-center justify-center rounded-full badge"
              :class="{
                'badge-vip': card.grade?.toString().toUpperCase() === 'VIP',
                'badge-gold': card.grade?.toString().toUpperCase() === 'GOLD',
                'badge-silver': card.grade?.toString().toUpperCase() === 'SILVER',
                'badge-white': card.grade?.toString().toUpperCase() === 'WHITE',
                'opacity-80': !card.isActive,
              }"
              :title="`Debug: grade='${card.grade}', type=${typeof card.grade}`"
            >
              {{ card.grade }}
            </span>
          </div>
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
