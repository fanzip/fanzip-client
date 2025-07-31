<script setup>
import BackIcon from '../../assets/membership/Vector (Stroke).svg' // 저장한 svg 경로에 맞게 수정
const goBack = () => {
  history.back()
}
</script>

<template>
  <div class="flex items-center w-full h-[48px] px-5 bg-white">
    <img :src="BackIcon" alt="뒤로가기" class="w-6 h-6 cursor-pointer" @click="goBack" />
    <slot />
  </div>
</template>
