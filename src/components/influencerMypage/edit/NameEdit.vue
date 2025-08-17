<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import icon from '@/assets/InfluencerProfile/BsXCircleFill.svg'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const clearInput = () => {
  emit('update:modelValue', '')
}

const hasValue = computed(() => props.modelValue?.length > 0)
</script>

<template>
  <div class="w-full px-5">
    <!-- 제목 텍스트 -->
    <div class="text-lg font-bold text-text-base mb-4">활동명을 입력해주세요</div>

    <!-- 입력 필드 컨테이너 -->
    <div class="relative w-full">
      <input
        type="text"
        :value="modelValue"
        @input="onInput"
        placeholder="활동명"
        class="w-full border-b border-subtle-border py-2 pr-8 text-base outline-none placeholder-subtle-text text-text-base"
      />

      <!-- X 버튼: 입력값이 있을 때만 표시 -->
      <button v-if="hasValue" @click="clearInput" class="absolute right-0 top-1/2 -translate-y-1/2">
        <img :src="icon" alt="clear" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
