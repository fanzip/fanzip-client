<script setup>
import profileImage from '@/assets/membership/여단오.png'

const profile = {
  name: '여단오',
  description: `안녕하세요 여단오입니다 저희는 한중커플입니다
              2025/08/12 팬미팅에서 봐요~ヾ(^▽^*)))
              2025/08/15 공구마켓 오픈 예정입니다.`,
  imageUrl: profileImage,
}
</script>

<template>
   <div class="flex items-start gap-4 bg-white p-5">
    <!-- 프로필 이미지 -->
    <img
      :src="profile.imageUrl"
      :alt="`${profile.name} 프로필 이미지`"
      class="w-20 h-20 rounded-full object-cover"
    />

    <!-- 텍스트 정보 -->
    <div>
      <!-- 이름 -->
      <p class="text-lg font-bold mb-1">{{ profile.name }}</p>

      <!-- 소개 텍스트 -->
      <p class="text-sm text-gray-700 leading-snug whitespace-pre-line">
        {{ profile.description }}
      </p>
    </div>
  </div>
</template>
