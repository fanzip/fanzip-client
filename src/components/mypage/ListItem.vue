<script setup>
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  menu: {
    type: String,
    default: '',
  },
  gap: {
    type: String,
    default: '1', // Tailwind 기준 gap-1 기본값
  },
})
</script>

<template>
  <div :class="`w-full flex gap-${gap} mt-6 items-center`">
    <img :src="src" alt="" class="w-5 h-5" />
    <p class="font-semibold">{{ menu }}</p>
  </div>
</template>
