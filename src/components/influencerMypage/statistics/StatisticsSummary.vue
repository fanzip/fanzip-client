<script setup>
import { ref } from 'vue'
import Increase from '@/assets/InfluencerProfile/Increase.svg'
import Decrease from '@/assets/InfluencerProfile/Decrease.svg'

const currentSubscribers = ref(60000000)
const totalRevenue = ref(12340000)

const todaySubscriberGrowth = ref(76)
const todayRevenueGrowth = ref(2200000)
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
