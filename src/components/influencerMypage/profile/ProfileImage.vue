<script setup>
import { ref } from 'vue'
import Ellipse from '@/assets/InfluencerProfile/Ellipse.svg'
import PlusIcon from '@/assets/InfluencerProfile/Plus.svg'
import { useInfluencerStore } from '@/stores/influencerStore'

const influencerStore = useInfluencerStore()
const fileInputRef = ref(null)

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const preview = URL.createObjectURL(file)
    influencerStore.setProfileImage(preview)
  }
}
</script>

<template>
  <div class="flex justify-center mt-24">
    <div class="relative w-24 h-24">
      <!-- 프로필 이미지 -->
      <img
        :src="influencerStore.profileImage"
        alt="프로필 이미지"
        class="w-24 h-24 rounded-full object-cover border"
      />
      <div class="absolute bottom-0 right-0 w-6 h-6 cursor-pointer" @click="triggerUpload">
        <img :src="Ellipse" alt="버튼 배경" class="absolute w-full h-full" />
        <img :src="PlusIcon" alt="플러스" class="absolute w-3 h-3 top-1.5 left-1.5" />
      </div>

      <!-- 숨겨진 파일 업로드 input -->
      <input
        type="file"
        accept="image/*"
        ref="fileInputRef"
        class="hidden"
        @change="onFileChange"
      />
    </div>
  </div>
</template>
