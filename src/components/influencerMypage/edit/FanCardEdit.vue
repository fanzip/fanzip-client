<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { updateInfluencerFanCardImage } from '@/api/influencerApi'
import { useInfluencerStore } from '@/stores/influencerStore'

const route = useRoute()
const influencerStore = useInfluencerStore()
const fileInputRef = ref(null)
const selectedImage = ref(null)
const isUploading = ref(false)

const onFileChange = async (e) => {
  const file = e.target.files[0]
  if (file) {
    // 파일 크기 체크 (2MB 제한)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('이미지 파일 크기는 2MB 이하여야 합니다.')
      return
    }
    
    selectedImage.value = URL.createObjectURL(file)
    
    // API로 팬카드 이미지 업로드
    await uploadFanCardImage(file)
  }
}

const uploadFanCardImage = async (file) => {
  try {
    isUploading.value = true
    const influencerId = route.params.influencerId
    
    console.log('업로드할 이미지:', {
      influencerId,
      fileName: file.name,
      fileSize: file.size
    })
    
    // S3 multipart 업로드
    const updatedImageUrl = await updateInfluencerFanCardImage(influencerId, file)
    
    // 업로드 성공 후 store 업데이트
    if (updatedImageUrl) {
      influencerStore.setFanCardImage(updatedImageUrl)
      console.log('팬카드 이미지 store 업데이트:', updatedImageUrl)
    }
    
    // 프로필에 fancard_image 필드가 추가되면 다시 활성화
    // try {
    //   const fanCardData = await getInfluencerFanCard(influencerId)
    //   console.log('팬카드 조회 결과:', fanCardData)
    //   if (fanCardData && fanCardData.fanCardImage) {
    //     influencerStore.setFanCardImage(fanCardData.fanCardImage)
    //   }
    // } catch (fanCardError) {
    //   console.warn('팬카드 조회 실패, 업로드 응답으로 대체:', fanCardError)
    //   if (updatedImageUrl) {
    //     influencerStore.setFanCardImage(updatedImageUrl)
    //   }
    // }
    
    console.log('팬카드 이미지 업로드 성공:', updatedImageUrl)
  } catch (error) {
    console.error('팬카드 이미지 업로드 실패:', error)
    console.error('에러 상세:', error.response?.data)
    
    // 이미지는 이미 UI에 표시되었으므로 너무 방해하지 않게 콘솔 로그만
    console.warn('백엔드 업로드 실패했지만 UI는 유지됩니다.')
    
    // 개발 중에만 alert 표시 (배포 시에는 제거)
    if (import.meta.env.DEV) {
      alert('팬카드 이미지 업로드에 실패했습니다. 콘솔을 확인해주세요.')
    }
  } finally {
    isUploading.value = false
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
