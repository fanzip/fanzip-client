<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProfileFanCard from '@/components/influencerMypage/profile/ProfileFanCard.vue';
import ProfileImage from '@/components/influencerMypage/profile/ProfileImage.vue';
import ProfileMenu from '@/components/influencerMypage/profile/ProfileMenu.vue';
import AppHeader from '@/components/layout/AppHeader.vue'
import { getInfluencerProfile } from '@/api/influencerApi'
import { useInfluencerStore } from '@/stores/influencerStore'

const route = useRoute()
const profileData = ref(null)
const isLoading = ref(false)
const influencerStore = useInfluencerStore()

const loadProfile = async () => {
  try {
    isLoading.value = true
    const influencerId = route.params.influencerId
    const data = await getInfluencerProfile(influencerId)
    profileData.value = data
    
    // store 업데이트 (가짜 URL 필터링)
    const getValidImageUrl = (imageUrl) => {
      console.log("$$$$", imageUrl)
      // 기본 가짜 이미지 URL만 필터링, S3 URL은 허용
      if (!imageUrl || imageUrl.includes('cdn.fanzip.com/profile/new.png')) {
        return null // 가짜 기본 이미지만 null로 처리
      }
      return imageUrl // S3 URL과 실제 CDN URL 모두 허용
    }
    

    influencerStore.setInfluencer({
      name: data.influencerName,
      description: data.description,
      profileImage: getValidImageUrl(data.profileImage),
      category: data.category,
      fanCardImage: getValidImageUrl(data.fanCardImage)
    })
  } catch (error) {
    console.error('프로필 로드 실패:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <ProfileImage/>
    <ProfileMenu/>
    <ProfileFanCard/>
  </div>
</template>
