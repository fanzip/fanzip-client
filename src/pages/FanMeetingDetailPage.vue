<template>
  <div class="w-full min-h-screen bg-white">
    <!-- Back Button (Top Left) -->
    <div class="w-full max-w-[393px] md:max-w-[430px] mx-auto relative">
      <div class="absolute top-6 left-6 z-10">
        <button @click="goBack" class="p-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="w-full max-w-[393px] md:max-w-[430px] mx-auto">
      <!-- Influencer Profile -->
      <div class="px-6 pt-20 pb-4">
        <div class="flex items-center">
          <div :class="`w-16 h-16 rounded-full bg-gradient-to-br ${fanMeetingData.bgColor} overflow-hidden mr-4`">
            <div class="w-full h-full flex items-center justify-center">
              <span class="text-white font-bold text-xl">{{ fanMeetingData.initial }}</span>
            </div>
          </div>
          <div>
            <h1 class="text-xl font-bold text-black">{{ fanMeetingData.name }}</h1>
          </div>
        </div>
      </div>

      <!-- Poster -->
      <div class="px-6 pb-24">
        <div class="w-full aspect-[3/4] bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg overflow-hidden flex items-center justify-center">
          <div class="text-center text-white">
            <h2 class="text-2xl font-bold mb-2">{{ fanMeetingData.title }}</h2>
            <p class="text-lg opacity-90">{{ fanMeetingData.subtitle }}</p>
            <div class="mt-4 text-sm opacity-80">
              <p>{{ fanMeetingData.date }}</p>
              <p>{{ fanMeetingData.venue }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservation Button -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div class="max-w-sm mx-auto px-4">
        <button 
          @click="goToSeatSelection"
          class="w-full bg-brand-primary text-black py-4 rounded-xl font-semibold hover:bg-brand-accent transition-colors"
        >
          예매하기
        </button>
      </div>
    </div>

    <!-- Spacer for fixed button -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const fanMeetingId = computed(() => route.params.id)

// 인플루언서별 팬미팅 데이터
const fanMeetingDataMap = {
  1: {
    name: '태요미네',
    title: '2025 태요미네 팬미팅',
    subtitle: '함께하는 특별한 시간',
    date: '2025.01.20 (월) 19:00',
    venue: '성동구 문화회관',
    initial: '태',
    bgColor: 'from-pink-400 to-purple-500'
  },
  2: {
    name: '여단오',
    title: '2025 여단오 팬미팅',
    subtitle: '내가 제일 예뻐',
    date: '2025.02.14 (금) 19:00',
    venue: '올림픽공원 올림픽홀',
    initial: '여',
    bgColor: 'from-blue-400 to-cyan-500'
  },
  3: {
    name: '침착맨',
    title: '2025 침착맨 팬미팅',
    subtitle: '침착하게 만나요',
    date: '2025.03.10 (월) 18:00',
    venue: '마포아트센터',
    initial: '침',
    bgColor: 'from-green-400 to-emerald-500'
  },
  4: {
    name: '토모토모',
    title: '2025 토모토모 팬미팅',
    subtitle: '토모토모와 함께',
    date: '2025.04.05 (토) 19:00',
    venue: '부산문화회관',
    initial: '토',
    bgColor: 'from-orange-400 to-red-500'
  },
  5: {
    name: '찰스엔터',
    title: '2025 찰스엔터 팬미팅',
    subtitle: '엔터테인먼트 타임',
    date: '2025.04.12 (토) 18:00',
    venue: '강남아트센터',
    initial: '찰',
    bgColor: 'from-purple-400 to-indigo-500'
  },
  6: {
    name: '뭐랭하맨',
    title: '2025 뭐랭하맨 팬미팅',
    subtitle: '뭐랭하는 시간',
    date: '2025.04.19 (토) 19:30',
    venue: '강남CGV',
    initial: '뭐',
    bgColor: 'from-yellow-400 to-orange-500'
  },
  7: {
    name: '빠더너스 BDNS',
    title: '2025 빠더너스 팬미팅',
    subtitle: 'BDNS와 함께',
    date: '2025.04.26 (토) 18:30',
    venue: '강남스타일홀',
    initial: '빠',
    bgColor: 'from-teal-400 to-blue-500'
  },
  8: {
    name: '쯔양',
    title: '2025 쯔양 팬미팅',
    subtitle: '먹방과 소통',
    date: '2025.05.03 (토) 19:00',
    venue: '강남맛집홀',
    initial: '쯔',
    bgColor: 'from-rose-400 to-pink-500'
  }
}

const fanMeetingData = computed(() => {
  return fanMeetingDataMap[fanMeetingId.value] || fanMeetingDataMap[1]
})

const goBack = () => {
  router.back()
}

const goToSeatSelection = () => {
  router.push(`/seat-select/${fanMeetingId.value}`)
}
</script>

<style scoped>
/* 추가 스타일링이 필요한 경우 여기에 작성 */
</style>