<script setup>
import { ref, onMounted,computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomButton from '@/components/common/ButtonNav.vue'
import FanMeetingProfile from '@/components/fanmeeting/detail/FanMeetingProfile.vue'
import FanMeetingPoster from '@/components/fanmeeting/detail/FanMeetingPoster.vue'
import { getFanMeetingDetail } from '@/api/fanMeetingApi'
import api from '@/api'

const route = useRoute()
const router = useRouter()
const fanMeetingId = Number(route.params.id)

const fanMeetingData = ref({})
const userGrade = ref('GENERAL')

const mapDetail = (raw) => {
  const d = raw?.data ?? raw

  const mapped = {
    meetingId: d?.meetingId ?? d?.meeting_id,
    title: d?.title ?? '팬미팅',
    description: d?.description ?? '',
    venueName: d?.venueName ?? d?.venue_name ?? '',
    venueAddress: d?.venueAddress ?? d?.venue_address ?? '',
    date: d?.meetingDate ?? d?.meeting_date ?? '',
    venue: d?.venueName ?? d?.venue_name ?? '',
    influencerId: d?.influencerId ?? d?.influencer_id ?? null,
    influencerName: d?.influencerName ?? d?.influencer_name ?? '',
    profileImageUrl: d?.profileImageUrl ?? d?.profile_image_url ?? '',
    posterImageUrl: d?.posterImageUrl ?? d?.poster_image_url ?? '',
    initial: (d?.influencerName ?? d?.influencer_name ?? 'F').charAt(0),
    bgColor: 'from-brand-primary to-brand-accent',
    // 예약 관련 정보 추가
    availableSeats: d?.availableSeats ?? d?.available_seats ?? 0,
    isReservationOpen: d?.isReservationOpen ?? d?.is_reservation_open ?? false,
    grade: d?.grade ?? 'GENERAL',
    // 등급별 오픈 시간
    vipOpenTime: d?.vipOpenTime ?? d?.vip_open_time ?? '',
    goldOpenTime: d?.goldOpenTime ?? d?.gold_open_time ?? '',
    silverOpenTime: d?.silverOpenTime ?? d?.silver_open_time ?? '',
    whiteOpenTime: d?.whiteOpenTime ?? d?.white_open_time ?? '',
    generalOpenTime: d?.generalOpenTime ?? d?.general_open_time ?? ''
  }
  return mapped
}

onMounted(async () => {
  try {
    const res = await getFanMeetingDetail(fanMeetingId)
    
    fanMeetingData.value = mapDetail(res)
    
    // 사용자의 멤버십 등급 조회 (인플루언서 ID 필요)
    if (fanMeetingData.value.influencerId) {
      try {
        const subscriptionResponse = await api.get(`/api/memberships/subscription/${fanMeetingData.value.influencerId}`)
        
        // gradeName을 userGrade로 사용 (VIP, GOLD, SILVER, WHITE, GENERAL)
        userGrade.value = subscriptionResponse.data?.gradeName || 'GENERAL'
        
      } catch (gradeError) {
        userGrade.value = 'GENERAL'
      }
    } else {
      userGrade.value = 'GENERAL'
    }
  } catch (e) {
  
    fanMeetingData.value = {
      title: '팬미팅 로딩 실패',
      description: '팬미팅 정보를 불러올 수 없습니다.',
      influencerId: null,
      availableSeats: 0,
      isReservationOpen: false
    }
  }
})

const goToSeatSelection = () => {
  if (canReserve.value) {
    router.push(`/reservation/${fanMeetingId}/seat`)
  }
}

// 현재 시간 기준 예약 가능 여부 (클라이언트 측 검증)
const isOpenByTime = computed(() => {
  const openTime = getCurrentGradeOpenTime.value
  if (!openTime) return true // 오픈 시간이 없으면 항상 오픈으로 간주
  
  const now = new Date()
  const openDate = new Date(openTime)
  return now >= openDate
})

// 예약 가능 여부 (서버 값과 클라이언트 검증 모두 확인)
const canReserve = computed(() => {
  const serverOpen = fanMeetingData.value.isReservationOpen
  const hasSeats = fanMeetingData.value.availableSeats > 0
  const timeOpen = isOpenByTime.value
  
  return (serverOpen || timeOpen) && hasSeats
})

// 버튼 텍스트 결정
const buttonText = computed(() => {
  if (fanMeetingData.value.availableSeats === 0) {
    return '잔여 좌석이 없습니다'
  }
  const serverOpen = fanMeetingData.value.isReservationOpen
  const timeOpen = isOpenByTime.value
  const openTime = getCurrentGradeOpenTime.value
  
  if (!serverOpen && !timeOpen && openTime) {
    const openDate = new Date(openTime)
    const year = openDate.getFullYear()
    const month = openDate.getMonth() + 1
    const day = openDate.getDate()
    const hours = openDate.getHours().toString().padStart(2, '0')
    const minutes = openDate.getMinutes().toString().padStart(2, '0')
    const seconds = openDate.getSeconds().toString().padStart(2, '0')
    
    return `${userGrade.value} 등급 오픈: ${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`
  }
  return '예매하기'
})

// 사용자 등급에 맞는 오픈 시간 가져오기
const getCurrentGradeOpenTime = computed(() => {
  const grade = userGrade.value?.toUpperCase() // fanMeetingData.value.grade 대신 userGrade.value 사용
  switch (grade) {
    case 'VIP':
      return fanMeetingData.value.vipOpenTime
    case 'GOLD':
      return fanMeetingData.value.goldOpenTime
    case 'SILVER':
      return fanMeetingData.value.silverOpenTime
    case 'WHITE':
      return fanMeetingData.value.whiteOpenTime
    case 'GENERAL':
    default:
      return fanMeetingData.value.generalOpenTime
  }
})

// 오픈 시간 메시지
const openTimeMessage = computed(() => {
  const serverOpen = fanMeetingData.value.isReservationOpen
  const timeOpen = isOpenByTime.value
  const openTime = getCurrentGradeOpenTime.value
  
  // 서버에서 오픈이 아니고, 시간상으로도 오픈이 아니고, 오픈 시간이 있는 경우에만 표시
  if (!serverOpen && !timeOpen && openTime) {
    const openDate = new Date(openTime)
    const year = openDate.getFullYear()
    const month = openDate.getMonth() + 1
    const day = openDate.getDate()
    const hours = openDate.getHours().toString().padStart(2, '0')
    const minutes = openDate.getMinutes().toString().padStart(2, '0')
    const seconds = openDate.getSeconds().toString().padStart(2, '0')
    
    return `${userGrade.value} 등급의 오픈 시간은 ${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds} 입니다.`
  }
  return ''
})
</script>

<template>
  <div class="w-full min-h-screen bg-base-bg">
    <AppHeader type="back-title" title="" />

    <div class="w-full max-w-[393px] md:max-w-[430px] mx-auto">
      <FanMeetingProfile :meetingId="fanMeetingId" :data="fanMeetingData" />
      <FanMeetingPoster  :meetingId="fanMeetingId" :data="fanMeetingData" />
      
    </div>

    <!-- 오픈 시간 안내 메시지 -->
    <div v-if="openTimeMessage" class="px-5 py-3 mx-5 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-sm text-yellow-800 text-center">{{ openTimeMessage }}</p>
    </div>


    <BottomButton 
      @click="goToSeatSelection" 
      :variant="canReserve ? 'primary' : 'cancel'" 
      :disabled="!canReserve"
      size="lg"
    >
      {{ buttonText }}
    </BottomButton>
    <div class="h-40"></div>
  </div>
</template>
