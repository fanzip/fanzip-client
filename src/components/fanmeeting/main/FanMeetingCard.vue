<template>
  <div class="flex items-center w-full h-20 cursor-pointer" @click="$emit('click')">
    <div
      class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 overflow-hidden mr-6 flex items-center justify-center"
    >
      <span class="text-white font-bold text-lg">{{ title.charAt(0) }}</span>
    </div>
    <div class="flex-1">
      <h3 class="text-base font-semibold text-black mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500">{{ venueName }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  venueName: String,
})
defineEmits(['click'])
</script>
