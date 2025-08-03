<script setup>
defineProps({
  name: String,
  description: String,
  imageUrl: String,
})
</script>

<template>
  <div class="flex items-start gap-4 bg-white p-5">
    <!-- 프로필 이미지 -->
    <img
      :src="imageUrl"
      :alt="`${name} 프로필 이미지`"
      class="w-20 h-20 rounded-full object-cover"
    />

    <!-- 텍스트 정보 -->
    <div>
      <!-- 이름 -->
      <p class="text-lg font-bold mb-1">{{ name }}</p>

      <!-- 소개 텍스트 -->
      <p class="text-sm text-gray-700 leading-snug whitespace-pre-line">
        {{ description }}
      </p>
    </div>
  </div>
</template>
