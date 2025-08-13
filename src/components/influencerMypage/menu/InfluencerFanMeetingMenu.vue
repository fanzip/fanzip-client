<script setup>
import ticket from '@/assets/mypage/Ticket.svg'
import check from '@/assets/mypage/BsCheckCircle-1.svg'
import { useRouter } from 'vue-router'

// import { useRouter } from 'vue-router'

// const router = useRouter()

// const goToSoldProducts = () => {
//   router.push('/') // 예매 확인 컴포넌트로
// }

const router = useRouter()

const items = [
  { icon: ticket, label: '팬미팅 정보 추가', routeName: 'FanmeetingCreate' },
  { icon: check,  label: '예매 확인',       routeName: 'TicketCheck' }, // 실제 등록된 name으로
]

const goToByName = (name) => {
  if (!name) return
  router.push({ name })
}
</script>

<template>
  <div>
    <div class="px-5 pt-5">
      <p class="text-xl font-bold text-black">나의 팬미팅 정보</p>
    </div>

    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center gap-3 px-5 py-3 cursor-pointer"
      @click="goToByName(item.routeName)"
    >
      <img :src="item.icon" alt="아이콘" class="w-5 h-5" />
      <span class="text-base font-medium text-black">{{ item.label }}</span>
    </div>
  </div>
</template>
