<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'

// TODO: 팬미팅 정보 api 연동
const ticket = {
  imgUrl: '/images/fanmeeting.jpg', // 팬미팅 이미지
  title: '2025 여단오 팬미팅 ‘내가 제일 예뻐’',
  location: '올림픽공원 체조경기장',
  date: '8/15',
  dayOfWeek: '목',
  time: '19:00',
  seat: 'F9',
  qrUrl: '/images/qr.png', // QR 이미지
}

const onClose = () => {
  // 닫기 처리 (예: emit or router.back())
  //   router.back()
  console.log('닫기')
}
</script>

<template>
  <div class="w-full min-h-screen flex flex-col bg-subtle-bg p-5">
    <AppHeader type="close"></AppHeader>
    <div class="bg-white rounded-lg shadow-md max-w-md w-full mt-12">
      <div class="p-5 flex flex-col">
        <img src="/src/assets/fancard/TomoTomo.svg" alt="" />
        <!-- <img :src="ticket.imgUrl" alt="ticket image" class="rounded-xl mb-2" /> -->
        <div class="mt-5">
          <p class="font-bold text-xl">{{ ticket.title }}</p>
          <div class="text-gray-500 text-base flex items-center gap-1">
            <img src="/src/assets/common/map-pin.svg" alt="" />
            <span>{{ ticket.location }}</span>
          </div>
        </div>
      </div>

      <div class="relative my-2 mx-4">
        <div class="border border-dashed border-subtle-border"></div>
        <div
          class="absolute -left-9 top-1/2 w-8 h-8 bg-subtle-bg rounded-full -translate-y-1/2"
        ></div>
        <div
          class="absolute -right-9 top-1/2 w-8 h-8 bg-subtle-bg rounded-full -translate-y-1/2"
        ></div>
      </div>

      <div class="p-7 flex justify-between items-center">
        <div class="space-y-5">
          <p class="text-lg font-medium">{{ ticket.date }}({{ ticket.dayOfWeek }})</p>
          <p class="text-3xl font-medium">{{ ticket.time }} ~</p>
          <div class="flex">
            <p class="font-normal text-base">일반석(</p>
            <p class="font-bold">{{ ticket.seat }}</p>
            <p>)</p>
          </div>
        </div>
        <!-- <img :src="ticket.qrUrl" alt="QR Code" class="w-20 h-20" /> -->
        <img src="/src/assets/fancard/QR_Code.svg" alt="" class="w-28" />
      </div>
      <div class="relative my-2 mx-4">
        <div class="border border-dashed border-subtle-border"></div>
        <div
          class="absolute -left-9 top-1/2 w-8 h-8 bg-subtle-bg rounded-full -translate-y-1/2"
        ></div>
        <div
          class="absolute -right-9 top-1/2 w-8 h-8 bg-subtle-bg rounded-full -translate-y-1/2"
        ></div>
      </div>

      <div class="flex flex-col justify-center text-xs text-subtle-text p-5 space-y-1">
        <p>· 입장은 팬미팅 시작 1시간 전부터 가능합니다.</p>
        <p>· 지정된 좌석 외의 착석은 제한됩니다.</p>
        <p>· 티켓은 타인에게 양도하거나 환불이 불가합니다.</p>
        <p>· 본 티켓은 모바일 화면으로만 입장이 가능합니다. (캡처 화면 불가)</p>
        <p>· 현장에서 본인 확인이 어려운 경우, 입장이 제한될 수 있습니다.</p>
      </div>
    </div>
  </div>
</template>
