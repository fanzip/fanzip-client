<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BarChart from './BarChart.vue'
import chartApi from '@/api/chartApi'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const graphSelection = ref('Revenue')
const filterSelection = ref('Day')

const influencerId = computed(() => authStore.influencerUserInfo.influencerId)

const revenue = ref([])
const dailyFanGrowth = ref([])
const weeklyFanGrowth = ref([])
const monthlyFanGrowth = ref([])

const transformApiData = (apiData) => {
  return apiData.map((item) => ({
    label: item.date,
    value: item.subscriberCount,
  }))
}

const transformApiData2 = (apiData) => {
  return apiData.map((item) => ({
    label: item.date,
    value: item.revenue,
  }))
}
const fetchDailyData = async () => {
  try {
    const data = await chartApi.getSubscriberStatsDaily(influencerId.value)
    dailyFanGrowth.value = transformApiData(data)
  } catch (e) {
    console.log('Daily fetch error:', e)
  }
}

const fetchWeeklyData = async () => {
  try {
    const data = await chartApi.getSubscriberStatsWeekly(influencerId.value)
    weeklyFanGrowth.value = transformApiData(data)
  } catch (e) {
    console.log('Weekly fetch error:', e)
  }
}

const fetchMonthlyData = async () => {
  try {
    const data = await chartApi.getSubscriberStatsMonthly(influencerId.value)
    monthlyFanGrowth.value = transformApiData(data)
  } catch (e) {
    console.log('Monthly fetch error:', e)
  }
}
const fetchMonthlyRevenue = async () => {
  try {
    const data = await chartApi.getMonthlyRevenue(influencerId.value)
    revenue.value = transformApiData2(data)
  } catch (e) {
    console.log('Mothly Revenue fetch error:', e)
  }
}
const fetchAllData = async () => {
  if (!influencerId.value) {
    return
  }

  try {
    await Promise.all([
      fetchMonthlyRevenue(),
      fetchDailyData(),
      fetchWeeklyData(),
      fetchMonthlyData(),
    ])
  } catch (e) {
    console.error('데이터 로딩 실패:', e)
  }
}

// influencerId 변경 감지
watch(
  influencerId,
  (newId, oldId) => {
    if (newId) {
      fetchAllData()
    }
  },
  { immediate: true },
) // immediate: true로 즉시 실행

onMounted(() => {
  console.log('차트 컴포넌트 마운트됨')
  console.log('현재 influencerId:', influencerId.value)

  // 이미 값이 있다면 바로 실행
  if (influencerId.value) {
    fetchAllData()
  }
})
</script>
<template>
  <div class="w-full rounded-xl p-5 flex flex-col bg-white">
    <div class="text-sm space-x-5">
      <button
        class="pb-1"
        @click="graphSelection = 'Revenue'"
        :class="graphSelection === 'Revenue' ? 'border-b-2 border-brand-primary font-semibold' : ''"
      >
        수익 그래프
      </button>
      <button
        class="pb-1"
        @click="graphSelection = 'Subscriber'"
        :class="
          graphSelection === 'Subscriber' ? 'border-b-2 border-brand-primary font-semibold' : ''
        "
      >
        구독 증가 그래프
      </button>
    </div>
    <div v-if="graphSelection === 'Revenue'">
      <p class="mt-7 text-center text-xl font-semibold">월별 수익 비교</p>
      <BarChart :data="revenue" :yTicks="4" :type="'revenue'" />
    </div>
    <div v-else>
      <p class="mt-7 text-center text-xl font-semibold">팬 증가 추이</p>
      <div class="flex justify-self-end w-36 h-6 my-2 text-xs">
        <button
          @click="filterSelection = 'Day'"
          class="w-1/3 rounded-s-md border border-black"
          :class="filterSelection === 'Day' ? 'bg-brand-primary font-semibold' : ' bg-subtle-bg'"
        >
          일
        </button>
        <button
          @click="filterSelection = 'Week'"
          class="w-1/3 border border-black"
          :class="filterSelection === 'Week' ? 'bg-brand-primary font-semibold' : ' bg-subtle-bg'"
        >
          주
        </button>
        <button
          @click="filterSelection = 'Month'"
          class="w-1/3 rounded-e-md border border-black"
          :class="filterSelection === 'Month' ? 'bg-brand-primary font-semibold' : 'bg-subtle-bg'"
        >
          월
        </button>
      </div>
      <BarChart
        :data="
          filterSelection === 'Day'
            ? dailyFanGrowth
            : filterSelection === 'Week'
              ? weeklyFanGrowth
              : monthlyFanGrowth
        "
        :y-ticks="4"
        :type="'fan'"
      />
    </div>
  </div>
</template>
