import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInfluencerStore = defineStore('influencer', () => {
  const name = ref('')
  const description = ref('')
  const profileImage = ref('')
  const coverImage = ref('')
  const category = ref('')
  const fanCardImage = ref('')
  function setInfluencer(payload) {
    name.value = payload.influencerName
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
