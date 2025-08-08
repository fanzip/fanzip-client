<template>
    <div class="flex justify-center mt-8 mb-8 gap-4">
      <div v-for="legend in legends" :key="legend.label" class="flex items-center">
        <div class="w-6 h-6 border-2 rounded mr-2" :style="legend.style"></div>
        <span class="text-base text-gray-600">{{ legend.label }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  const legends = [
    { label: '선택 가능', style: 'background-color: white; border-color: #3a3a3a' },
    { label: '선택 완료', style: 'background-color: #ffe685; border-color: #3a3a3a' },
    { label: '선택 불가', style: 'background-color: #cccccc; border-color: #3a3a3a' }
  ]
  </script>
  