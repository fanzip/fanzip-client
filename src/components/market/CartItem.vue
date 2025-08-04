<template>
  <div class="bg-white ml-5 mr-5 p-4" :class="{ 'rounded-b-lg mb-4': isLast }">
    <!-- 1) 첫 번째 줄: 체크박스 + 썸네일 + 상품명 -->
    <div class="flex items-start">
      <!-- 체크박스 -->
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only" v-model="selected" />
        <img :src="selected ? checkedBox : uncheckedBox" class="w-5 h-5" alt="checkbox" />
      </label>

      <!-- 썸네일 -->
      <img
        :src="item.thumbnailImage"
        alt="썸네일"
        class="w-16 h-16 object-cover rounded ml-3 flex-shrink-0"
      />

      <!-- 상품명 -->
      <p class="ml-3 text-base leading-snug flex-1">
        {{ item.productName }}
      </p>
    </div>

    <!-- 2) 두 번째 줄: 수량 조절 + 가격 -->
    <div class="flex items-center justify-between ml-7">
      <!-- 수량 조절 바 -->
      <div class="flex items-center space-x-2">
        <button @click="changeQty(item.quantity - 1)" :disabled="item.quantity <= 1">
          <img src="@/assets/market/minus-circle.svg" class="w-6 h-6" alt="minus" />
        </button>
        <span class="font-bold">{{ item.quantity }}</span>
        <button @click="changeQty(item.quantity + 1)" :disabled="item.quantity >= item.stock">
          <img src="@/assets/market/plus-circle.svg" class="w-6 h-6" alt="plus" />
        </button>
      </div>

      <!-- 가격 -->
      <div class="text-right space-x-3">
        <span class="text-base line-through text-nav-deactivated"
          >{{ (item.unitPrice * item.quantity).toLocaleString() }}원</span
        >
        <span class="font-bold">{{ item.totalPrice.toLocaleString() }}원</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import marketApi from '@/api/marketApi'
import checkedBox from '@/assets/market/checked-box.svg'
import uncheckedBox from '@/assets/market/unchecked-box.svg'

const props = defineProps({
  item: { type: Object, required: true },
  isLast: { type: Boolean, default: false },
})
const emit = defineEmits(['refresh'])

// 로컬 selected 상태
const selected = ref(props.item.isSelected)

watch(
  () => props.item.isSelected,
  (newVal) => {
    selected.value = newVal
  },
)

// 체크박스 토글 시 API 호출 & 상위컴포넌트 갱신
watch(selected, async (val) => {
  await marketApi.updateCartItem({
    cartItemId: props.item.cartItemId,
    quantity: props.item.quantity,
    isSelected: val,
  })
  emit('refresh')
})

// 수량 변경
async function changeQty(newQty) {
  if (newQty < 1 || newQty > props.item.stock) return
  await marketApi.updateCartItem({
    cartItemId: props.item.cartItemId,
    quantity: newQty,
    isSelected: selected.value,
  })
  emit('refresh')
}
</script>
