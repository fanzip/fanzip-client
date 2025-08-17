<script setup>
import product from '@/assets/mypage/product.svg'
import check from '@/assets/mypage/BsCheckCircle-1.svg'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const influencerId = computed(() => auth.influencerUserInfo?.influencerId)

const items = [
  { icon: product, label: '상품 추가', routeName: 'market-create', needsId: true },
  { icon: check, label: '판매 상품 확인' },
]

// 공통 이동 함수
const goTo = (routeName, needsId = false) => {
  if (!routeName) return
  if (!needsId) return router.push({ name: routeName })

  const id = influencerId.value || +router.currentRoute.value.params.influencerId
  if (!id) return alert('인플루언서 정보가 없습니다.')
  router.push({ name: routeName, params: { influencerId: id } })
}
</script>

<template>
  <div>
    <!-- <div class="px-5 pt-5">
      <p class="text-lg font-bold text-black">나의 마켓</p>
    </div> -->
    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center gap-2 px-5 py-3"
      @click="goTo(item.routeName, item.needsId)"
    >
      <img :src="item.icon" alt="아이콘" class="cursor-pointer" />
      <span class="text-base font-semibold text-black cursor-pointer">{{ item.label }}</span>
    </div>
  </div>
</template>
