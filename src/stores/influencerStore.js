import { defineStore } from 'pinia'
import { ref } from 'vue'
import image from '@/assets/influencer/찰스엔터프로필.svg'
import FanCard from '@/assets/influencer/찰스엔터팬카드.svg'

export const useInfluencerStore = defineStore('influencer', () => {
  const name = ref('찰스엔터')
  const description = ref('안녕하세요 찰스엔터입니다 내가 선생이야 누나야')
  const profileImage = ref(image)
  const coverImage = ref('')
  const category = ref('일상')
  const fanCardImage = ref(FanCard)
  

  function setInfluencer(payload) {    
    console.log([payload])
    name.value = payload.name
    description.value = payload.description
    profileImage.value = payload.profileImage
    coverImage.value = payload.coverImage
    // fanCardImage가 null이거나 빈 값이면 기존 값 유지
    if (payload.fanCardImage) {
      fanCardImage.value = payload.fanCardImage
    }
    category.value = payload.category || ''
  }

  function resetInfluencer() {
    name.value = ''
    description.value = ''
    profileImage.value = ''
    coverImage.value = ''
    category.value = ''
    fanCardImage.value = ''
  }

  function updateName(newName) {
    name.value = newName
  }

  function setCategory(newCategory) {
    category.value = newCategory
  }

  function setDescription(newDescription) {
    description.value = newDescription
  }

  function setProfileImage(newImage) {
    profileImage.value = newImage
  }

  function setFanCardImage(newImage) {
    fanCardImage.value = newImage
  }

  return {
    name,
    description,
    profileImage,
    coverImage,
    category,
    fanCardImage,

    setInfluencer,
    resetInfluencer,
    updateName,
    setCategory,
    setDescription,
    setProfileImage,
    setFanCardImage,
  }
})
