<script setup>
import ticket from '@/assets/mypage/Ticket.svg'
import check from '@/assets/mypage/BsCheckCircle-1.svg'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'


const router = useRouter()
const auth = useAuthStore()
const influencerId = computed(() => auth.influencerUserInfo?.influencerId)

// const goToSoldProducts = () => {
//   router.push('/') // 예매 확인 컴포넌트로
// }

const items = [
  { icon: ticket, label: '팬미팅 정보 추가', routeName: 'FanmeetingCreate', needsId: true },
  { icon: check,  label: '예매 확인',       routeName: 'TicketCheck' }, // 실제 등록된 name으로
]

const goToByName = (name, needsId = false) => {
  if (!name) return
  if (needsId) {
    // authStore가 없으면 현재 라우트의 params도 fallback
    const id = influencerId.value || +router.currentRoute.value.params.influencerId
    if (!id) return alert('인플루언서 정보가 없습니다.')
    router.push({ name, params: { influencerId: id } })
  } else {
    router.push({ name })
  }
}
</script>

<template>
  <div>
    <div class="px-5 pt-5">
      <p class="text-lg font-bold text-black">나의 팬미팅 정보</p>
    </div>

    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center gap-3 px-5 py-3 cursor-pointer"
      @click="goToByName(item.routeName, item.needsId)"
    >
      <img :src="item.icon" alt="아이콘" class="w-5 h-5" />
      <span class="text-base font-medium text-black">{{ item.label }}</span>
    </div>
  </div>
</template>
