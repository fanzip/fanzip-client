<template>
  <div class="pb-24 pt-4">
    <div
      v-if="data.posterImageUrl"
      class="w-full max-w-[393px] h-[523px] rounded-lg overflow-hidden flex items-center justify-center mx-auto"
    >
      <img :src="data.posterImageUrl" :alt="data.title" class="w-full h-full object-cover" />
    </div>

    <div
      v-else
      class="w-full h-[523px] rounded-lg bg-gradient-to-br overflow-hidden flex items-center justify-center mx-auto"
      :class="data.bgColor"
    >
      <div class="text-center text-white">
        <h2 class="text-2xl font-bold mb-2">{{ data.title }}</h2>
        <p class="text-lg opacity-90">{{ data.subtitle }}</p>
        <div class="mt-4 text-sm opacity-80">
          <p>{{ data.date }}</p>
          <p>{{ data.venue }}</p>
        </div>
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
