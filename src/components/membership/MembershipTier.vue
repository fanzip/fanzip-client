<script setup>
import { ref } from 'vue'

import ChevronIcon from '../../assets/membership/IoChevronBackSharp.svg'

const tiers = ['VIP', 'GOLD', 'SILVER', 'WHITE']
const openedTier = ref(null)

const benefits = {
  VIP: ['팬미팅 오픈 2일 전 선예매', '굿즈 오픈 2일 전 구매', '한정판 굿즈 구매 기회'],
  GOLD: ['팬미팅 오픈 1일 전 선예매', '굿즈 오픈 1일 전 구매'],
  SILVER: ['팬미팅 오픈 1일 전 선예매'],
  WHITE: ['기본 혜택'],
}

function toggleTier(tier) {
  openedTier.value = openedTier.value === tier ? null : tier
}

function getTierClass(tier) {
  return {
    VIP: 'bg-black text-white',
    GOLD: 'bg-brand-primary text-black',
    SILVER: 'bg-[#D9D9D9] text-black',
    WHITE: 'bg-[#EFEFEF] text-black',
  }[tier]
}
</script>

<template>
  <!-- p-1는 padding 4px -->
  <div class="bg-white rounded-lg">
    <h2 class="font-bold text-[16px] mb-4">멤버십 등급별 혜택</h2>

    <div v-for="tier in tiers" :key="tier" class="mb-3">
      <!-- 티어 상단 -->
      <div
        :class="[
          'flex items-center justify-between px-4 py-3 rounded-[8px] shadow cursor-pointer',
          getTierClass(tier),
          openedTier == tier ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]',
        ]"
        @click="toggleTier(tier)"
      >
        <span class="font-bold">{{ tier }}</span>

        <!-- 아이콘 (SVG) -->
        <img
          :src="ChevronIcon"
          alt="화살표 아이콘"
          class="w-[18px] h-[18px] transition-transform duration-0"
          :class="{ 'rotate-180': openedTier === tier }"
        />
      </div>

      <!-- 혜택 내용 박스 -->
      <ul
        v-show="openedTier === tier"
        class="bg-white text-[14px] px-5 py-3 shadow-lg rounded-b-[8px]"
      >
        <li v-for="(text, idx) in benefits[tier]" :key="idx" class="mb-1">• {{ text }}</li>
      </ul>
    </div>
  </div>
</template>
