<template>
  <div class="w-full min-h-screen" style="background-color: #f6f6f6">
    <!-- Header -->
    <div class="bg-white w-full py-4 px-5">
      <div class="flex items-center justify-between w-full max-w-xs md:max-w-sm mx-auto">
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
    </div>

    <!-- White Container -->
    <div class="w-full max-w-xs md:max-w-sm mx-auto min-h-screen">
      <!-- Content with spacing -->
      <div class="p-5 space-y-5 pb-24" style="margin-top: 0; padding-top: 20px">
        <!-- Fan Meeting Info -->
        <FanMeetingInfo :fanMeeting="currentFanMeeting" />

        <!-- Seat Map -->
        <SeatMap
          :seatMap="seatMap"
          :selectedSeat="selectedSeat"
          @seatSelected="handleSeatSelected"
        />

        <!-- Selected Seat Info -->
        <SelectedSeatInfo :selectedSeat="selectedSeat" :price="'36,000'" />
      </div>

      <!-- Bottom Button -->
      <div class="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
        <div class="w-full max-w-[393px] md:max-w-[430px] mx-auto flex justify-center">
          <BaseButton
            @click="proceedToPayment"
            :disabled="!selectedSeat"
            :variant="selectedSeat ? 'primary' : 'cancel'"
            size="lg"
          >
            예매하기
          </BaseButton>
        </div>
      </div>

      <!-- Bottom Spacer for Navigation -->
      <div class="h-40"></div>
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
