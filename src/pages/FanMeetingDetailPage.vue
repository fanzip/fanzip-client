<template>
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">팬미팅 상세 페이지</h1>
      <!-- 추후 상세 정보 영역 구성 -->
      <p>이곳에 팬미팅 상세 내용을 표시합니다.</p>
    </div>
  </template>
  
  <script setup>
  // 향후 팬미팅 id 등을 가져와 처리할 수 있도록 준비
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  // const fanMeetingId = route.params.id // 추후 필요 시 사용
  </script>
  
  <style scoped>
  /* 추후 상세 페이지 스타일링 여기에 추가 */
  </style>