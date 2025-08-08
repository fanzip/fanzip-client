<template>
    <div class="bg-white rounded-lg pt-4 pb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-base text-gray-600 ml-4">선택</span>
        <span class="text-base text-black font-medium mr-5">{{ seatName }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-base text-gray-600 ml-4">가격</span>
        <span class="text-xl font-bold mr-5 text-brand-accent">{{ price }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ seatName: String, price: String })
  </script>
  