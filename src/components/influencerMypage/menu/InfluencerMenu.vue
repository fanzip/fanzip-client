<script setup>
import InfluencerAccountMenu from './InfluencerAccountMenu.vue'
import InfluencerMarketMenu from './InfluencerMarketMenu.vue'
import InfluencerFanMeetingMenu from './InfluencerFanMeetingMenu.vue'
</script>
<template>
  <div class="w-full rounded-xl flex flex-col bg-white py-2">
    <InfluencerAccountMenu />
    <hr />
    <InfluencerMarketMenu />
    <hr />
    <InfluencerFanMeetingMenu />
  </div>
</template>
