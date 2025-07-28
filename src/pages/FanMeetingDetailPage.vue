<template>
  <div class="w-full min-h-screen bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 bg-white">
      <button @click="goBack" class="p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-black">팬미팅 상세</h1>
      <div class="w-6"></div>
    </div>

    <!-- Main Content -->
    <div class="px-4 pb-32">
      <!-- Fan Meeting Image -->
      <div class="w-full h-64 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-6 overflow-hidden">
        <div class="w-full h-full flex items-center justify-center">
          <div class="text-center text-white">
            <h2 class="text-2xl font-bold mb-2">{{ fanMeetingInfo.title }}</h2>
            <p class="text-lg opacity-90">{{ fanMeetingInfo.subtitle }}</p>
          </div>
        </div>
      </div>

      <!-- Fan Meeting Info -->
      <div class="space-y-6">
        <!-- Title -->
        <div>
          <h3 class="text-xl font-bold text-black mb-2">{{ fanMeetingInfo.title }}</h3>
          <p class="text-gray-600">{{ fanMeetingInfo.subtitle }}</p>
        </div>

        <!-- Details -->
        <div class="space-y-4">
          <!-- Date -->
          <div class="flex items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#6B7280" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="#6B7280" stroke-width="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="#6B7280" stroke-width="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="#6B7280" stroke-width="2"/>
            </svg>
            <div>
              <p class="text-sm text-gray-500">일시</p>
              <p class="text-base font-semibold text-black">{{ fanMeetingInfo.date }}</p>
            </div>
          </div>

          <!-- Venue -->
          <div class="flex items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3">
              <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="#6B7280" stroke-width="2"/>
              <circle cx="12" cy="10" r="3" stroke="#6B7280" stroke-width="2"/>
            </svg>
            <div>
              <p class="text-sm text-gray-500">장소</p>
              <p class="text-base font-semibold text-black">{{ fanMeetingInfo.venue }}</p>
            </div>
          </div>

          <!-- Price -->
          <div class="flex items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3">
              <line x1="12" y1="1" x2="12" y2="23" stroke="#6B7280" stroke-width="2"/>
              <path d="M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H7" stroke="#6B7280" stroke-width="2"/>
            </svg>
            <div>
              <p class="text-sm text-gray-500">가격</p>
              <p class="text-base font-semibold text-black">{{ fanMeetingInfo.price }}원</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h4 class="text-lg font-semibold text-black mb-3">상세 정보</h4>
          <p class="text-gray-700 leading-relaxed">{{ fanMeetingInfo.description }}</p>
        </div>
      </div>
    </div>

    <!-- Reservation Button -->
    <div class="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div class="max-w-sm mx-auto px-4">
        <button 
          @click="goToSeatSelection"
          class="w-full bg-brand-primary text-black py-4 rounded-lg font-semibold hover:bg-brand-accent transition-colors"
        >
          예매하기
        </button>
      </div>
    </div>

    <!-- Spacer for fixed button -->
    <div class="h-32"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const fanMeetingId = computed(() => route.params.id)

// 팬미팅 정보 (실제로는 API에서 가져올 데이터)
const fanMeetingInfo = ref({
  id: 1,
  title: '2025 여단오 팬미팅',
  subtitle: '내가 제일 예뻐',
  date: '2025년 2월 14일 (금) 19:00',
  venue: '올림픽공원 올림픽홀',
  price: '99,000',
  description: '여단오와 함께하는 특별한 시간! 다양한 이벤트와 소통의 시간이 준비되어 있습니다. 팬들과의 만남을 통해 더욱 가까워질 수 있는 소중한 기회입니다.'
})

// 팬미팅 ID에 따른 정보 설정
const fanMeetingData = {
  1: {
    title: '2025 태요미네 팬미팅',
    subtitle: '함께하는 특별한 시간',
    date: '2025년 1월 20일 (월) 19:00',
    venue: '성동구 문화회관',
    price: '89,000'
  },
  2: {
    title: '2025 여단오 팬미팅',
    subtitle: '내가 제일 예뻐',
    date: '2025년 2월 14일 (금) 19:00',
    venue: '올림픽공원 올림픽홀',
    price: '99,000'
  },
  3: {
    title: '2025 침착맨 팬미팅',
    subtitle: '침착하게 만나요',
    date: '2025년 3월 10일 (월) 18:00',
    venue: '마포아트센터',
    price: '79,000'
  }
}

onMounted(() => {
  const id = fanMeetingId.value
  if (fanMeetingData[id]) {
    fanMeetingInfo.value = {
      ...fanMeetingInfo.value,
      ...fanMeetingData[id]
    }
  }
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