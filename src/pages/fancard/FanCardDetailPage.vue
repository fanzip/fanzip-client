<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router' 
import AppNav from '@/components/layout/AppNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

import tomoTomoImg from '@/assets/fancard/TomoTomo.svg'
import silverBadge from '@/assets/fancard/Silver.svg'
import iconCreditCard from '@/assets/fancard/icon-credit-card.svg'
import iconCreditCard2 from '@/assets/fancard/icon-credit-card2.svg'
import iconGift from '@/assets/fancard/icon-gift.svg'
import iconFanzip from '@/assets/fancard/icon-fanzip.svg'

const router = useRouter() 
const route = useRoute() 
const fanMeetingId = route.query.id 

const goToTicket = (fanMeetingId) => {
  router.push({
    path: '/ticket',
    query: { fanMeetingId } 
  })
}

const fanCard = ref({
  fanMeetingId: 123,
  nickname: '토모토모',
  grade: 'Silver',
  gradeImg: silverBadge,
  joinDate: '2025.07.16',
  joinDday: 31,
  monthlyFee: 9900,
  totalPaid: 140000,
  benefits: [
    '팬미팅 오픈 <span class="font-bold">2일 전</span> 선예매',
    '굿즈 오픈 <span class="font-bold">2일 전</span> 구매',
    '한정판 굿즈 구매 기회',
    '월 <span class="font-bold">₩2000</span> 추가시 <span class="text-brand-accent font-bold">GOLD</span> 업그레이드'
  ],
  history: [
    { title: '구독 시작', amount: 13900, date: '2025.07.01', bold: true },
    { title: '[촉촉 마스크팩] 구매', amount: 30000, date: '2025.07.02', bold: true },
    { title: '[맛좋은 꿀떡] 구매', amount: 30000, date: '2025.07.02', bold: true },
    { title: '[토모토모가 말해주는 국제 커플 팁 예매]', amount: 80000, date: '2025.07.02', bold: true },
    { title: '구독 해지', amount: null, date: '2025.07.15', bold: true },
  ],
  imageUrl: tomoTomoImg
})
</script>

<template>
  <AppHeader type="back" />

  <div class="bg-subtle-bg min-h-screen pt-24 pb-28 px-9">

    <!-- 1. 상단 이미지 + 배지 -->
    <div class="relative w-full h-[180px] rounded-lg overflow-hidden shadow-md">
      <img :src="fanCard.imageUrl" alt="fan card" class="w-full h-full object-cover" />
      <img :src="fanCard.gradeImg" alt="grade" class="absolute top-2 right-3 w-[80px] h-[24px]" />
    </div>

    <!-- 2. 예약 안내 배너 -->
    <div class="w-full max-w-sm mx-auto mt-3 bg-base-bg rounded-lg shadow-md text-center py-3 text-sm font-semibold">
      예약한 팬미팅 내역이 있어요.<br />
      <span
        class="text-base-text text-sm font-semibold underline cursor-pointer"
        @click="goToTicket(fanCard.fanMeetingId)"
      >
        바로 확인하기
      </span>
    </div>

    <!-- 3. 기본 정보 박스 -->
    <div class="w-full max-w-sm mx-auto mt-5 bg-base-bg rounded-lg shadow-md p-4 space-y-3">
      <!-- 닉네임 + Silver 배지 같은 줄 -->
      <div class="flex items-center gap-2">
        <span class="font-bold text-base-text text-base">{{ fanCard.nickname }}</span>
        <img :src="fanCard.gradeImg" alt="grade" class="w-[80px] h-[24px]" />
      </div>

      <!-- 가입일 -->
      <p class="text-sm subtle-text flex items-center gap-8">
        <span>가입일</span>
        <span>
          {{ fanCard.joinDate }}
          <span class="font-bold">(D+{{ fanCard.joinDday }})</span>
        </span>
      </p>

      <!-- 월 납입 / 총 납입 -->
      <div class="mt-4 text-sm space-y-2">
        <p class="flex items-center gap-2">
          <img :src="iconCreditCard" class="w-4 h-4" alt="월 납입" />
          <span class="text-base">월 납입</span>
          <span class="text-base font-bold">{{ fanCard.monthlyFee.toLocaleString() }}원</span>
        </p>
        <p class="flex items-center gap-2">
          <img :src="iconCreditCard2" class="w-4 h-4" alt="총 납입" />
          <span class="text-base">총 납입</span>
          <span class="text-base font-bold">{{ fanCard.totalPaid.toLocaleString() }}원</span>
        </p>
      </div>
    </div>

    <!-- 4. 혜택 박스 -->
    <div class="w-full max-w-sm mx-auto mt-3.5 bg-base-bg rounded-lg shadow-md p-4">
      <div class="flex items-center mb-2 gap-2 border-b border-subtle-border pb-2">
        <img :src="iconGift" class="w-5 h-5" alt="혜택" />
        <h3 class="font-semibold text-base">혜택</h3>
      </div>
      <ul class="list-none text-sm space-y-1 text-base pl-1">
        <li v-for="(benefit, idx) in fanCard.benefits" :key="idx" v-html="benefit"></li>
      </ul>
    </div>

    <!-- 5. 구독 히스토리 -->
    <div class="w-full max-w-sm mx-auto mt-3.5 bg-base-bg rounded-lg shadow-md p-4">
      <div class="flex items-center mb-2 gap-2 border-b border-subtle-border pb-2">
        <img :src="iconFanzip" class="w-5 h-5" alt="추억" />
        <h3 class="font-semibold text-base">{{ fanCard.nickname }}와의 추억</h3>
      </div>
      <ul class="divide-y divide-subtle-border text-sm text-base">
        <li
          v-for="(item, idx) in fanCard.history"
          :key="idx"
          class="py-2"
        >
          <div class="ml-4">
            <p :class="{'font-bold': item.bold}">{{ item.title }}</p>
            <p v-if="item.amount" class="text-subtle-text">{{ item.amount.toLocaleString() }}원</p>
            <p class="text-xs text-subtle-text">{{ item.date }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 6. 하단 구독 취소 텍스트 -->
    <div class="w-full max-w-sm mx-auto mt-4 mb-8 flex justify-center">
      <span class="text-subtle-text text-sm">구독 취소하기</span>
    </div>

    <!-- 7. 하단 네비게이션 -->
    <app-nav class="fixed bottom-0 left-0 w-full" />
  </div>
</template>