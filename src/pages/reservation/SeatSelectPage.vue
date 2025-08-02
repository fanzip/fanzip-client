<template>
  <div class="w-full min-h-screen bg-subtle-bg">
    <!-- Header -->
    <AppHeader type="back-title" title="" />

    <!-- White Container -->
    <div class="w-full max-w-[393px] mx-auto min-h-screen">
      <!-- Content with spacing -->
      <div class="px-5 md:px-0 pt-[68px] pb-7 space-y-5">
        <!-- Fan Meeting Info -->
        <div class="bg-white rounded-lg p-4">
          <h3 class="text-lg font-bold text-black mb-4.5">{{ currentFanMeeting.title }}</h3>
          <p class="text-sm mb-2 text-subtle-text">{{ currentFanMeeting.date }}</p>
          <div class="flex items-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
                stroke="#808080"
                stroke-width="2"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="2" />
            </svg>
            <span class="ml-1 text-sm text-black">{{ currentFanMeeting.venue }}</span>
          </div>
        </div>

        <!-- Seat Map -->
        <div class="bg-white rounded-lg p-4">
          <!-- Stage -->
          <div
            class="rounded-xl py-2 mt-4 mb-4 w-full max-w-[313px] h-8 mx-auto flex items-center justify-center"
            style="background-color: #60584c"
          >
            <p class="text-center text-white text-base font-normal">STAGE</p>
          </div>

          <!-- Seat Map -->
          <div class="mb-6">
            <!-- Row Labels -->
            <div class="flex">
              <div class="text-lg text-gray-600 mr-3 flex-shrink-0 flex flex-col gap-1">
                <div v-for="row in seatRows" :key="row" class="h-6 flex items-center">
                  {{ row }}
                </div>
              </div>

              <!-- Seats Grid -->
              <div class="min-w-fit">
                <div class="flex flex-col gap-1">
                  <div v-for="(row, rowIndex) in seatMap" :key="rowIndex" class="flex gap-0.5">
                    <button
                      v-for="(seat, seatIndex) in row"
                      :key="seatIndex"
                      @click="selectSeat(rowIndex, seatIndex)"
                      :disabled="seat.status === 'occupied'"
                      :class="getSeatClass(seat)"
                      :style="
                        seat.status === 'occupied'
                          ? 'background-color: #CCCCCC; border-color: #666666; color: #60584C;'
                          : seat.selected
                            ? 'background-color: #FFE685; border-color: #666666; color: #60584C;'
                            : 'border-color: #666666; color: #60584C;'
                      "
                      class="w-6 h-6 rounded text-xs font-medium transition-colors flex-shrink-0"
                      style="font-size: 12px"
                    >
                      {{ seat.number }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seat Legend -->
          <div class="flex justify-center mt-8 mb-8 gap-4">
            <div class="flex items-center">
              <div
                class="w-6 h-6 bg-white border-2 rounded mr-2"
                style="border-color: #3a3a3a"
              ></div>
              <span class="text-base text-gray-600">선택 가능</span>
            </div>
            <div class="flex items-center">
              <div
                class="w-6 h-6 border-2 rounded mr-2"
                style="background-color: #ffe685; border-color: #3a3a3a"
              ></div>
              <span class="text-base text-gray-600">선택 완료</span>
            </div>
            <div class="flex items-center">
              <div
                class="w-6 h-6 border-2 rounded mr-2"
                style="background-color: #cccccc; border-color: #3a3a3a"
              ></div>
              <span class="text-base text-gray-600">선택 불가</span>
            </div>
          </div>
        </div>

        <!-- Selected Seat Info -->
        <div v-if="selectedSeat" class="bg-white rounded-lg">
          <div class="pt-4 pb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-base text-gray-600 ml-4">선택</span>
              <span class="text-base text-black font-medium mr-5"
                >{{ selectedSeat.row }}{{ selectedSeat.number }}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-base text-gray-600 ml-4">가격</span>
              <span class="text-xl font-bold mr-5 text-brand-accent">36,000원</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Button -->
    <BottomButton
      @click="proceedToPayment"
      :disabled="!selectedSeat"
      :variant="selectedSeat ? 'primary' : 'cancel'"
      size="lg"
    >
      예매하기
    </BottomButton>

    <!-- Bottom Spacer for Navigation -->
    <div class="h-24"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomButton from '@/components/common/ButtonNav.vue'

const router = useRouter()
const route = useRoute()

const selectedSeat = ref(null)
const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']

// 팬미팅 데이터
const fanMeetingData = {
  1: {
    name: '태요미네',
    title: "2025 태요미네 팬미팅 '내가 제일 예뻐'",
    date: '2025년 8월 15일 (목) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  2: {
    name: '여단오',
    title: "2025 여단오 팬미팅 '내가 제일 예뻐'",
    date: '2025년 8월 20일 (화) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  3: {
    name: '김민지',
    title: "2025 김민지 팬미팅 '내가 제일 예뻐'",
    date: '2025년 8월 25일 (일) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  4: {
    name: '이서연',
    title: "2025 이서연 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 1일 (일) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  5: {
    name: '박지우',
    title: "2025 박지우 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 5일 (목) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  6: {
    name: '최유나',
    title: "2025 최유나 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 10일 (화) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  7: {
    name: '정하린',
    title: "2025 정하린 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 15일 (일) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  8: {
    name: '송예린',
    title: "2025 송예린 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 20일 (금) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
}

// 현재 팬미팅 정보
const currentFanMeeting = computed(() => {
  return fanMeetingData[route.params.id] || fanMeetingData[1]
})

// 좌석 맵 생성 (Figma 디자인 기반)
const seatMap = ref([
  // A-O 행, 각 행당 11개 좌석
  ...Array.from({ length: 15 }, (_, rowIndex) =>
    Array.from({ length: 11 }, (_, seatIndex) => ({
      number: seatIndex + 1,
      row: seatRows[rowIndex],
      status: Math.random() > 0.7 ? 'occupied' : 'available', // 랜덤하게 일부 좌석 점유
      selected: false,
    })),
  ),
])

const selectSeat = (rowIndex, seatIndex) => {
  const seat = seatMap.value[rowIndex][seatIndex]

  if (seat.status === 'occupied') return

  // 기존 선택 해제
  if (selectedSeat.value) {
    const prevSeat = seatMap.value
      .find((row) => row.find((s) => s.selected))
      ?.find((s) => s.selected)
    if (prevSeat) prevSeat.selected = false
  }

  // 새 좌석 선택
  seat.selected = true
  selectedSeat.value = {
    row: seat.row,
    number: seat.number,
    rowIndex,
    seatIndex,
  }
}

const getSeatClass = (seat) => {
  if (seat.status === 'occupied') {
    return 'cursor-not-allowed border-2'
  }
  if (seat.selected) {
    return 'border-2'
  }
  return 'bg-white border-2 hover:border-brand-primary'
}

const proceedToPayment = () => {
  if (!selectedSeat.value) return

  // 선택된 좌석 정보를 쿼리 파라미터로 전달
  router.push({
    path: `/reservation/${route.params.id}/payment`,
    query: {
      seat: `${selectedSeat.value.row}${selectedSeat.value.number}`,
      price: '36000',
    },
  })
}
</script>
