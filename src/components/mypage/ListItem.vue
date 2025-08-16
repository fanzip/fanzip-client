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
  <div :class="`w-full flex gap-${gap} mt-4`">
    <img :src="src" alt="" />
    <p class="font-semibold">{{ menu }}</p>
  </div>
</template>
