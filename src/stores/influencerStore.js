import { defineStore } from 'pinia'

export const useInfluencerStore = defineStore('influencer', {
  state: () => ({
    name: '',
    description: '',
    profileImage: '',
    coverImage: '',
  }),
  actions: {
    setInfluencer({ name, description, profileImage, coverImage }) {
      this.name = name
      this.description = description
      this.profileImage = profileImage
      this.coverImage = coverImage
    },
    resetInfluencer() {
      this.name = ''
      this.description = ''
      this.profileImage = ''
      this.coverImage = ''
    },
  },
})
