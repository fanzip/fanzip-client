import { defineStore } from 'pinia'
import image from '@/assets/influencer/찰스엔터프로필.svg'
import FanCard from '@/assets/influencer/찰스엔터팬카드.svg'

export const useInfluencerStore = defineStore('influencer', {
  state: () => ({
    name: '찰스엔터',
    description: '안녕하세요 찰스엔터입니다 내가 선생이야 누나야',
    profileImage: image,
    coverImage: '',
    category: '일상',
    fanCardImage: FanCard,
  }),
  actions: {
    setInfluencer({ name, description, profileImage, coverImage, category, fanCardImage }) {
      this.name = name
      this.description = description
      this.profileImage = profileImage
      this.coverImage = coverImage
      this.fanCardImage = fanCardImage || ''
      if (category) this.category = category
    },
    resetInfluencer() {
      this.name = ''
      this.description = ''
      this.profileImage = ''
      this.coverImage = ''
      this.category = ''
      this.fanCardImage = ''
    },
    updateName(newName) {
      this.name = newName
    },
    setCategory(newCategory) {
      this.category = newCategory
    },
    setDescription(newDescription) {
      this.description = newDescription
    },
    setProfileImage(newImage) {
      this.profileImage = newImage
    },
    setFanCardImage(newImage) {
      this.fanCardImage = newImage
    },
  },
})
