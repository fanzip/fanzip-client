<script setup>
import { ref } from 'vue'

const fileInputRef = ref(null)
const selectedImage = ref(null)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedImage.value = URL.createObjectURL(file)
  }
}

const triggerUpload = () => {
  fileInputRef.value?.click()
}

defineExpose({
  selectedImage,
})
</script>

<template>
  <div class="w-full px-5 flex flex-col items-start">
    <div class="text-base font-bold mb-4 self-start">팬카드 사진 등록</div>
    <div
      class="w-full h-48 rounded-xl bg-subtle-bg border subtle-border flex items-center justify-center relative overflow-hidden"
    >
      <img
        v-if="selectedImage"
        :src="selectedImage"
        alt="선택한 이미지"
        class="absolute w-full h-full object-cover"
      />
      <button
        v-else
        class="flex items-center justify-center text-sm text-subtle-text bg-base-bg border subtle-border px-4 py-2 rounded shadow"
        @click="triggerUpload"
      >
        팬카드 이미지 등록
      </button>
      <input
        type="file"
        accept="image/*"
        class="hidden"
        ref="fileInputRef"
        @change="onFileChange"
      />
    </div>
  </div>
</template>
