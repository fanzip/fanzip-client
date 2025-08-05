<script setup>
import profile from '../../assets/influencer/찰스엔터프로필.svg'

const name = '찰스엔터'
const imageUrl = profile
</script>

<template>
  <div class="flex items-start gap-4 bg-white p-5 mt-10">
    <img
      :src="imageUrl"
      :alt="`${name} 프로필 이미지`"
      class="w-20 h-20 rounded-full object-cover"
    />
    <div class="flex flex-col justify-center">
      <p class="text-lg font-semibold">{{ name }}님, 안녕하세요!</p>
    </div>
  </div>
</template>
