<template>
  <div class="bg-white rounded-lg p-4">
    <h3 class="text-lg font-bold text-black mb-1.5">{{ title }}</h3>

    <p v-if="description" class="text-sm text-gray-600 mb-3 whitespace-pre-line">
      {{ description }}
    </p>

    <p class="text-sm mb-2 text-subtle-text">{{ date }}</p>
    <div class="flex items-center">
      <img :src="MapPinIcon" alt="장소 아이콘" class="w-4 h-4" />
      <span class="ml-1 text-sm text-black">{{ venue }}</span>
    </div>
  </div>
</template>

<script setup>
import MapPinIcon from '@/assets/common/map-pin.svg'
defineProps({ title: String, date: String, venue: String, description: String })
</script>
