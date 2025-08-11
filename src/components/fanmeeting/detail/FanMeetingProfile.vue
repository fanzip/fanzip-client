<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  meetingId: Number,
  data: { type: Object, default: () => ({}) }
})

const imgError = ref(false)
const showImg = computed(() => !!props.data?.profileImageUrl && !imgError.value)
const onError = () => { imgError.value = true }
</script>

<template>
  <div class="px-9 pt-[68px]">
    <div class="flex items-center">
      <div class="w-16 h-16 rounded-full overflow-hidden mr-6">
        <img
          v-if="showImg"
          :src="data.profileImageUrl"
          :alt="data.influencerName || ''"
          class="w-full h-full object-cover"
          @error="onError"
        />
        <div v-else :class="`w-full h-full bg-gradient-to-br ${data.bgColor || ''}`" class="flex items-center justify-center">
          <span class="text-white font-bold text-xl">{{ data.initial || (data.influencerName?.[0] ?? 'F') }}</span>
        </div>
      </div>
      <div>
        <h1 class="text-lg font-semibold text-black">{{ data.influencerName || '알 수 없음' }}</h1>
      </div>
    </div>
  </div>
</template>
