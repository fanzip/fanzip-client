<template>
  <div class="w-full min-h-screen bg-base-bg">
    <AppHeader type="logo" />

    <!-- 고정된 검색창 -->
    <div
      class="fixed top-[48px] left-0 right-0 z-10 bg-base-bg transition-transform duration-300"
      :class="{ 'transform -translate-y-full': !showSearchBar }"
      ref="searchContainer"
    >
      <div class="fixed left-0 right-0 z-10 bg-base-bg ">
        <div class="pt-3 mb-2 flex justify-center">
          <SearchBar ref="searchBarRef" />
        </div>
      </div>
    </div>

    <!-- 스페이서 (검색창 높이만큼) -->
    <div class="h-[120px]"></div>

    <!-- 구독한 인플루언서의 팬미팅 -->
    <div v-if="filteredSubscribedMeetings.length > 0">
      <h2 class="text-md font-semibold text-text-base mb-3 pt-3 pl-10">구독 중인 인플루언서</h2>
      <FanMeetingList :meetings="filteredSubscribedMeetings" @click="goToDetail" />
    </div>

    <!-- 구독하지 않은 인플루언서의 팬미팅 -->
    <div v-if="filteredNonSubscribedMeetings.length > 0">
      <h2 class="text-md font-semibold text-text-base mb-3 pl-10">모든 인플루언서</h2>
      <FanMeetingList :meetings="filteredNonSubscribedMeetings" @click="goToDetail" />
    </div>

    <!-- 검색 결과가 없을 때 -->
    <div
      v-if="filteredSubscribedMeetings.length === 0 && filteredNonSubscribedMeetings.length === 0"
      class="px-5 py-10 text-center text-subtle-text"
    >
      팬미팅이 없습니다.
    </div>

    <AppNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import FanMeetingList from '@/components/fanmeeting/main/FanMeetingList.vue'
import { getSubscribedFanMeetings, getNonSubscribedFanMeetings } from '@/api/fanMeetingApi'

const router = useRouter()
const searchBarRef = ref(null)
const searchContainer = ref(null)
const subscribedMeetings = ref([])
const nonSubscribedMeetings = ref([])
const showSearchBar = ref(true)
const lastScrollY = ref(0)

// 구독한 인플루언서의 팬미팅 필터링
const filteredSubscribedMeetings = computed(() => {
  const keyword = searchBarRef.value?.keyword || ''
  if (!Array.isArray(subscribedMeetings.value)) {
    return []
  }
  return subscribedMeetings.value.filter((m) =>
    m.title.toLowerCase().includes(keyword.toLowerCase()),
  )
})

// 구독하지 않은 인플루언서의 팬미팅 필터링
const filteredNonSubscribedMeetings = computed(() => {
  const keyword = searchBarRef.value?.keyword || ''
  if (!Array.isArray(nonSubscribedMeetings.value)) {
    return []
  }
  return nonSubscribedMeetings.value.filter((m) =>
    m.title.toLowerCase().includes(keyword.toLowerCase()),
  )
})

// 스크롤 이벤트 처리
const handleScroll = () => {
  const currentScrollY = window.scrollY

  if (currentScrollY < 50) {
    // 최상단 근처에서는 항상 검색창 표시
    showSearchBar.value = true
  } else if (currentScrollY > lastScrollY.value) {
    showSearchBar.value = false
  } else {
    // 위로 스크롤: 검색창 표시
    showSearchBar.value = true
  }

  lastScrollY.value = currentScrollY
}

const goToDetail = (id) => {
  router.push(`/reservation/${id}`)
}

onMounted(async () => {
  try {
    const [subscribedResult, nonSubscribedResult] = await Promise.all([
      getSubscribedFanMeetings('GENERAL'),
      getNonSubscribedFanMeetings('GENERAL'),
    ])

    subscribedMeetings.value = Array.isArray(subscribedResult) ? subscribedResult : []
    nonSubscribedMeetings.value = Array.isArray(nonSubscribedResult) ? nonSubscribedResult : []

    } catch (e) {
    console.error('❌ 팬미팅 조회 실패:', e)
    subscribedMeetings.value = []
    nonSubscribedMeetings.value = []
  }

  // 스크롤 이벤트 리스너 추가
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  // 스크롤 이벤트 리스너 제거
  window.removeEventListener('scroll', handleScroll)
})
</script>
