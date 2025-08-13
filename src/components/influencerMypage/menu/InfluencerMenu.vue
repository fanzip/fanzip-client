<script setup>
import InfluencerAccountMenu from './menu/InfluencerAccountMenu.vue'
import InfluencerMarketMenu from './menu/InfluencerMarketMenu.vue'
import InfluencerFanMeetingMenu from './menu/InfluencerFanMeetingMenu.vue'
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
