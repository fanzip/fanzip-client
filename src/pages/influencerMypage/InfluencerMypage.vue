<script setup>
import InfluencerProfile from '@/components/influencerMypage/InfluencerProfile.vue'
import StatisticsSummary from '@/components/influencerMypage/statistics/StatisticsSummary.vue'
import Statistics from '@/components/influencerMypage/statistics/Statistics.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import ReportAlert from '@/components/influencerMypage/statistics/ReportAlert.vue'
import InfluencerMenu from '@/components/influencerMypage/menu/InfluencerMenu.vue'
import { getInfluencerMyProfile } from '@/api/influencerApi'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

onMounted(async () => {
  // 데이터가 없을 때만 API 호출
  if (!authStore.influencerUserInfo.influencerName) {
    try {
      const data = await getInfluencerMyProfile()
      authStore.setinfluencerUserInfo(data)
    } catch (e) {
      console.error(e)
    }
  }
})
</script>

<template>
  <AppHeader type="logo" />
  <div class="bg-base-bg overflow-hidden p-5 pb-20 min-h-screen bg-subtle-bg space-y-4">
    <InfluencerProfile />
    <StatisticsSummary />
    <Statistics />
    <ReportAlert />
    <InfluencerMenu />
    <!-- 컴포넌트 넣기 -->
    <div class="bg-subtle-bg py-3">
      <div class="text-xs flex gap-5">
        <p>이용약관</p>
        <p>개인정보 처리방침</p>
      </div>
      <div class="text-sm text-subtle-text mt-6 mb-0">
        <p>COPYRIGHT © (주)좋은데요</p>
        <p>ALL RIGHTS RESERVED.</p>
      </div>
    </div>
    <AppNav />
  </div>
</template>
