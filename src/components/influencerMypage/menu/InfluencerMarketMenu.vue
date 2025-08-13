<script setup>
import product from '@/assets/mypage/product.svg'
import check from '@/assets/mypage/BsCheckCircle-1.svg'

// import { useRouter } from 'vue-router'

// const router = useRouter()

// const goToSoldProducts = () => {
//   router.push('/') // 판매 상품 확인 컴포넌트로
// }

const items = [
  { icon: product, label: '상품 추가' },
  { icon: check, label: '판매 상품 확인' },
]
</script>

<template>
  <div>
    <div class="px-5 pt-5">
      <p class="text-lg font-bold text-black">나의 마켓</p>
    </div>
    <div v-for="(item, index) in items" :key="index" class="flex items-center gap-2 px-5 py-3">
      <img :src="item.icon" alt="아이콘" class="w-5 h-5 cursor-pointer" />
      <span class="text-base font-medium text-black cursor-pointer">{{ item.label }}</span>
    </div>
  </div>
</template>
