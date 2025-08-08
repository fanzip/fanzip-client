<template>
  <div class="bg-white rounded-lg p-4">
    <div
      class="rounded-[12px] h-8 max-w-[313px] w-full bg-[#60584C] text-white mx-1 flex items-center justify-center text-md mb-4"
    >
      STAGE
    </div>
    <div class="mb-6 flex">
      <div class="text-lg text-gray-600 mr-3 flex-shrink-0 flex flex-col gap-1">
        <div v-for="row in seatRows" :key="row" class="h-6 flex items-center">{{ row }}</div>
      </div>
      <div class="min-w-fit flex flex-col gap-1">
        <div v-for="(row, rowIndex) in seatMap" :key="rowIndex" class="flex gap-0.5">
          <button
            v-for="(seat, seatIndex) in row"
            :key="seatIndex"
            :disabled="seat.status === 'occupied'"
            @click="$emit('selectSeat', rowIndex, seatIndex)"
            :class="getSeatClass(seat)"
            :style="getSeatStyle(seat)"
            class="w-6 h-6 rounded text-xs font-medium transition-colors flex-shrink-0"
            style="font-size: 12px"
          >
            {{ seat.number }}
          </button>
        </div>
      </div>
    </div>
    <SeatLegend />
  </div>
</template>

<script setup>
import SeatLegend from './SeatLegend.vue'

defineProps({ seatMap: Array, seatRows: Array })

const getSeatClass = (seat) => {
  if (seat.status === 'occupied') return 'cursor-not-allowed border-2'
  if (seat.selected) return 'border-2'
  return 'bg-white border-2 hover:border-brand-primary'
}
const getSeatStyle = (seat) => {
  if (seat.status === 'occupied')
    return 'background-color: #CCCCCC; border-color: #666666; color: #60584C;'
  if (seat.selected) return 'background-color: #FFE685; border-color: #666666; color: #60584C;'
  return 'border-color: #666666; color: #60584C;'
}
</script>
