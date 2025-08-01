<template>
  <div class="bg-white rounded-lg p-4">
    <h3 class="text-lg font-bold text-black mb-4">결제 방법</h3>
    <div class="flex flex-col items-center gap-2">
      <label 
        v-for="method in paymentMethods" 
        :key="method.id"
        class="flex items-center p-3 border cursor-pointer transition-colors w-full max-w-[322px] h-[43px] rounded-[12px]"
        :class="{
          'border-[#FFBC00]': selectedPaymentMethod === method.id,
          'border-[#DEDEDE]': selectedPaymentMethod !== method.id
        }"
        @click="selectPaymentMethod(method.id)"
      >
        <input 
          type="radio" 
          :value="method.id" 
          v-model="selectedPaymentMethod"
          class="sr-only"
        />
        
        <!-- Custom Radio Button -->
        <div class="relative w-4 h-4 rounded-full border border-[#DEDEDE] mr-4 flex-shrink-0">
          <div v-if="selectedPaymentMethod === method.id" class="absolute top-1/2 left-1/2 w-[10px] h-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFBC00]"></div>
        </div>

        <div class="flex items-center w-full">
          <div class="w-8 h-8 mr-3 flex items-center justify-center">
            <img :src="method.icon" :alt="method.name" />
          </div>
          <span class="font-medium text-black">{{ method.name }}</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KBPayIcon from '@/assets/icons/KBPay.svg'
import KakaoPayIcon from '@/assets/icons/KakaoPay.svg'
import TossPayIcon from '@/assets/icons/TossPay.svg'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'kb'
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedPaymentMethod = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const paymentMethods = [
  { id: 'kb', name: 'KB Pay', icon: KBPayIcon },
  { id: 'kakao', name: '카카오페이', icon: KakaoPayIcon },
  { id: 'toss', name: '토스페이', icon: TossPayIcon }
]

const selectPaymentMethod = (methodId) => {
  selectedPaymentMethod.value = methodId
}
</script>