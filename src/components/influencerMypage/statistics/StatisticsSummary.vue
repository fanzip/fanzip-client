<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import Increase from '@/assets/InfluencerProfile/Increase.svg'
import Decrease from '@/assets/InfluencerProfile/Decrease.svg'
import chartApi from '@/api/chartApi'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const currentSubscribers = ref(0)
const todaySubscriberGrowth = ref(0)
const totalRevenue = ref(12340000)
const todayRevenueGrowth = ref(2200000)

const influencerId = computed(() => authStore.influencerUserInfo.influencerId)

const fetchSubscriberStatus = async () => {
  try {
    if (!influencerId.value) {
      console.warn('influencerId가 없습니다:', influencerId.value)
      return
    }

    // await 키워드 추가
    const data = await chartApi.getSubscriberStatus(influencerId.value)

    currentSubscribers.value = data.totalSubscribers
    todaySubscriberGrowth.value = data.todayNetChange
  } catch (e) {
    console.error('구독자 상태 로딩 실패:', e)
  }
}

const fetchRevenue = async () => {
  try {
    if (!influencerId.value) {
      console.warn('influencerId가 없습니다:', influencerId.value)
      return
    }

    // await 키워드 추가
    const data = await chartApi.getTotalRevenue(influencerId.value)
    totalRevenue.value = data.revenue

    const data2 = await chartApi.getTodayRevenue(influencerId.value)
    todayRevenueGrowth.value = data2.revenue
  } catch (e) {
    console.error('구독자 상태 로딩 실패:', e)
  }
}

// influencerId 변경 감지
watch(
  influencerId,
  (newId) => {
    if (newId) {
      fetchSubscriberStatus()
      fetchRevenue()
    }
  },
  { immediate: true },
)

onMounted(() => {
  // 이미 값이 있다면 바로 실행
  if (influencerId.value) {
    fetchSubscriberStatus()
    fetchRevenue()
  }
})
</script>
<template>
  <div class="gap-4 flex">
    <div class="w-1/2 rounded-xl p-4 flex flex-col items-center bg-white space-y-1">
      <p class="font-semibold">현재 구독자</p>
      <p class="font-semibold">{{ currentSubscribers.toLocaleString() }}명</p>
      <div class="flex gap-2 text-xs font-medium">
        <p>Today:</p>
        <img :src="Increase" />
        <p>{{ todaySubscriberGrowth.toLocaleString() }}명</p>
      </div>
    </div>
    <div class="w-1/2 rounded-xl p-4 flex flex-col items-center bg-white space-y-1">
      <p class="font-semibold">누적 수익</p>
      <p class="font-semibold">{{ totalRevenue.toLocaleString() }}원</p>
      <div class="flex gap-2 text-xs font-medium">
        <p class="font-medium">Today:</p>
        <img :src="Decrease" />
        <p>{{ todayRevenueGrowth.toLocaleString() }}원</p>
      </div>
    </div>
  </div>
</template>
