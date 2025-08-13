<script setup>
import Report from '@/assets/InfluencerProfile/Report.svg'
</script>
<template>
  <div class="w-full rounded-xl flex flex-col bg-white p-4">
    <div class="flex gap-1 items-center">
      <img :src="Report" class="w-6 h-6" />
      <p class="text-md font-semibold">AI 기반 활동 리포트가 준비됐어요</p>
    </div>

    <p class="text-sm font-medium mt-1">지난주 패턴을 바탕으로 다음 주 행동 가이드를 만들었어요.</p>
    <button class="bg-subtle-bg rounded-lg mt-3 mx-auto py-2 px-3 text-sm font-medium">
      리포트 확인하기
    </button>
  </div>
</template>
