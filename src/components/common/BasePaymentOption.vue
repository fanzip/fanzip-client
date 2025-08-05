<script setup>
defineProps({
  modelValue: String, // v-model용
})
defineEmits(['update:modelValue'])

import KbPayIcon from '@/assets/membership/KB.svg'
import KakaoPayIcon from '@/assets/membership/kakao.svg'
import TossIcon from '@/assets/membership/toss.svg'

const paymentMethods = [
  { id: 'kb', name: 'KB Pay', icon: KbPayIcon },
  { id: 'kakao', name: '카카오페이', icon: KakaoPayIcon },
  { id: 'toss', name: '토스페이', icon: TossIcon },
]
</script>

<template>
  <div class="bg-base-bg rounded-lg">
    <h2 class="font-bold text-xl mb-4">결제 방법</h2>

    <div
      v-for="method in paymentMethods"
      :key="method.id"
      class="flex items-center justify-between px-4 py-2 border rounded-lg mb-2 cursor-pointer"
      :class="modelValue === method.id ? 'border-brand-primary border-2' : 'border-subtle-border'"
      @click="$emit('update:modelValue', method.id)"
    >
      <div class="flex items-center gap-3">
        <div class="relative w-4 h-4 rounded-full border border-subtle-border flex-shrink-0">
          <div
            v-if="modelValue === method.id"
            class="absolute top-1/2 left-1/2 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent"
          ></div>
        </div>

        <img :src="method.icon" alt="logo" class="w-6 h-6" />
        <span class="font-normal">{{ method.name }}</span>
      </div>
    </div>
  </div>
</template>
