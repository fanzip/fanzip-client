<!-- src/components/market/ProductsList.vue -->
<template>
  <div class="cursor-pointer" @click="goToDetail">
    <!-- 이미지 -->
    <img :src="item.thumbnailImage" :alt="item.name" class="w-full rounded-lg object-cover" />

    <!-- 상품명 -->
    <div class="h-12">
      <p class="text-base line-clamp-2">
        {{ item.name }}
      </p>
    </div>

    <!-- 정가 (취소선) -->
    <div class="text-base text-subtle-text line-through">{{ item.price.toLocaleString() }}원</div>

    <!-- 할인가 + 할인율 -->
    <div class="flex items-center justify-between">
      <span class="font-extrabold text-xl">{{ item.discountedPrice.toLocaleString() }}원 </span>
      <span class="text-text-emphasis font-extrabold text-xl">
        {{ Math.round(item.discountRate * 100) }}%
      </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const goToDetail = () => {
  router.push(`/market/${props.item.productId}`)
}
</script>
