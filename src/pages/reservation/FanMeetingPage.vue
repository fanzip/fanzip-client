<template>
 <div class="w-full min-h-screen bg-base-bg">
    <AppHeader type="logo" />
    <FanMeetingSearch ref="searchRef" />
    <FanMeetingList :meetings="filteredMeetings" @click="goToDetail" />
    <AppNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import FanMeetingSearch from '@/components/fanmeeting/main/FanMeetingSearch.vue'
import FanMeetingList from '@/components/fanmeeting/main/FanMeetingList.vue'
import { getFanMeetings } from '@/api/fanMeetingApi'

const router = useRouter()
const searchRef = ref(null)
const meetings = ref([])

// 검색 키워드 변경 핸들러 (현재 미사용)


const filteredMeetings = computed(() => {
  const keyword = searchRef.value?.searchBarRef?.keyword || ''
  if (!Array.isArray(meetings.value)) {
    return []
  }
  return meetings.value.filter((m) =>
    m.title.toLowerCase().includes(keyword.toLowerCase())
  )
})
const goToDetail = (id) => {
  router.push(`/reservation/${id}`)
}

onMounted(async () => {
  try {
    const result = await getFanMeetings()
    meetings.value = Array.isArray(result) ? result : []
  } catch (e) {
    console.error('팬미팅 조회 실패:', e)
    meetings.value = []
  }
})
</script>
