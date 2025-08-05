<script setup>
import InfluencerAccountMenu from '@/components/influencerMypage/InfluencerAccountMenu.vue'
import InfluencerFanMeetingMenu from '@/components/influencerMypage/InfluencerFanMeetingMenu.vue'
import InfluencerMarketMenu from '@/components/influencerMypage/InfluencerMarketMenu.vue'
import InfluencerProfile from '@/components/influencerMypage/InfluencerProfile.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
</script>

<template>
  <div class="bg-base-bg overflow-hidden pb-20 min-h-screen">
    <AppHeader type="logo" />
    <InfluencerProfile />
    <hr />
    <InfluencerAccountMenu />
    <hr />
    <InfluencerMarketMenu />
    <hr />
    <InfluencerFanMeetingMenu />

    <!-- 컴포넌트 넣기 -->
    <div class="bg-subtle-bg py-3 pl-5">
      <div class="text-xs flex gap-5">
        <p>이용약관</p>
        <p>개인정보 처리방침</p>
      </div>
      <div class="text-sm text-subtle-text mt-24 mb-0">
        <p>COPYRIGHT © (주)좋은데요</p>
        <p>ALL RIGHTS RESERVED.</p>
      </div>
    </div>
    <AppNav />
  </div>
</template>
