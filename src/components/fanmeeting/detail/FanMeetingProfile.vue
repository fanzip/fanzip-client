<template>
  <div class="px-9 pt-[68px]">
    <div class="flex items-center">
      <div v-if="meetingId == 2" class="w-16 h-16 rounded-full overflow-hidden mr-6">
        <img :src="image" :alt="data.name" class="w-full h-full object-cover" />
      </div>
      <div
        v-else
        :class="`w-16 h-16 rounded-full bg-gradient-to-br ${data.bgColor} overflow-hidden mr-6`"
      >
        <div class="w-full h-full flex items-center justify-center">
          <span class="text-white font-bold text-xl">{{ data.initial }}</span>
        </div>
      </div>
      <div>
        <h1 class="text-lg font-semibold text-black">{{ data.name }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  meetingId: Number,
  data: Object,
  image: String,
})
</script>
