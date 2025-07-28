<template>
  <div class="w-full min-h-screen" style="background-color: #f6f6f6">
    <!-- Header -->

    <button @click="goBack" class="flex items-center justify-center w-8 h-8">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <h1 class="text-xl font-semibold text-black">좌석 선택</h1>
    <div class="w-8"></div>
  </div>

  <!-- White Container -->
  <div class="w-full max-w-xs md:max-w-sm mx-auto min-h-screen">
    <!-- Content with spacing -->
    <div class="p-5 space-y-5 pb-24" style="margin-top: 0; padding-top: 20px">
      <!-- Fan Meeting Info -->
      <FanMeetingInfo :fanMeeting="currentFanMeeting" />

      <!-- Seat Map -->
      <SeatMap :seatMap="seatMap" :selectedSeat="selectedSeat" @seatSelected="handleSeatSelected" />

      <!-- Selected Seat Info -->
      <SelectedSeatInfo :selectedSeat="selectedSeat" :price="'36,000'" />
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200"
      style="padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px))"
    >
      <div class="max-w-sm mx-auto px-4">
        <button
          @click="proceedToPayment"
          :disabled="!selectedSeat"
          :class="{
            'bg-brand-primary text-black': selectedSeat,
            'bg-gray-300 text-gray-500': !selectedSeat,
          }"
          class="w-full py-4 rounded-xl font-bold text-lg transition-colors"
        >
          예매하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import FanMeetingInfo from '@/components/common/FanMeetingInfo.vue'
import SeatMap from '@/components/common/SeatMap.vue'
import SelectedSeatInfo from '@/components/common/SelectedSeatInfo.vue'
import { fanMeetingData } from '@/data/fanMeetingData.js'
</script>
