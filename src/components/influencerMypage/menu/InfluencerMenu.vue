<script setup>
import InfluencerAccountMenu from './InfluencerAccountMenu.vue'
import InfluencerMarketMenu from './InfluencerMarketMenu.vue'
import InfluencerFanMeetingMenu from './InfluencerFanMeetingMenu.vue'
import InfluencerEtcMenu from './InfluencerEtcMenu.vue'
</script>
<template>
  <div class="w-full rounded-xl flex flex-col bg-white py-2">
    <InfluencerAccountMenu />
    <hr class="mx-4 my-1" />
    <InfluencerMarketMenu />
    <hr class="mx-4 my-1" />
    <InfluencerFanMeetingMenu />
    <hr class="mx-4 my-1" />
    <InfluencerEtcMenu />
  </div>
</template>
