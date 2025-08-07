<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Ellipse from '@/assets/InfluencerProfile/Ellipse.svg'
import PlusIcon from '@/assets/InfluencerProfile/Plus.svg'
import { useInfluencerStore } from '@/stores/influencerStore'
import { updateInfluencerProfileImage } from '@/api/influencerApi'

const route = useRoute()
const influencerStore = useInfluencerStore()
const fileInputRef = ref(null)
const isUploading = ref(false)

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const onFileChange = async (e) => {
  const file = e.target.files[0]
  if (file) {
    const preview = URL.createObjectURL(file)
    influencerStore.setProfileImage(preview)
    
    // API로 이미지 업로드
    await uploadProfileImage(file)
  }
}

const uploadProfileImage = async (file) => {
  try {
    isUploading.value = true
    const influencerId = route.params.influencerId
    
    // S3 multipart 업로드
    const updatedImageUrl = await updateInfluencerProfileImage(influencerId, file)
    
    // 백엔드에서 반환된 이미지 URL로 store 업데이트
    if (updatedImageUrl) {
      influencerStore.setProfileImage(updatedImageUrl)
    }
    
    console.log('프로필 이미지 업로드 성공:', updatedImageUrl)
  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error)
    alert('이미지 업로드에 실패했습니다.')
  } finally {
    isUploading.value = false
  }
}


const getValidImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.includes('cdn.fanzip.com/profile/new.png')) {
    return Ellipse // 기본 이미지로 대체
  }
  return imageUrl
}

const handleImageError = (event) => {
  console.error('이미지 로드 실패:', {
    url: event.target.src,
    error: event
  })
  
  // 네트워크 탭에서 상세 에러 확인을 위해 잠시 대기
  fetch(event.target.src)
    .then(response => {
      console.log('Fetch 테스트 결과:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
    })
    .catch(error => {
      console.error('Fetch 테스트 에러:', error)
    })
  
  event.target.src = Ellipse // 에러 시 기본 이미지로 변경
}
</script>

<template>
  <div class="flex justify-center mt-24">
    <div class="relative w-24 h-24">
      <!-- 프로필 이미지 -->
      <img
        :src="getValidImageUrl(influencerStore.profileImage)"
        alt="프로필 이미지"
        class="w-24 h-24 rounded-full object-cover border"
        @error="handleImageError"
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
