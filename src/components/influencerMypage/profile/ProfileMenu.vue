<script setup>
import Icon from '@/assets/membership/Vector.svg'
import { useRouter } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'

const router = useRouter()
const influencerStore = useInfluencerStore()

const goToEditName = () => {
  router.push('/influencer/profile/edit-name')
}

const goToEditCategory = () => {
  router.push('/influencer/profile/edit-category')
}

const goToEditIntro = () => {
  router.push('/influencer/profile/edit-intro')
}
</script>

<template>
  <div class="px-5 space-y-4 mt-8">
    <!-- 이름 -->
    <div class="flex items-center justify-between">
      <span class="text-sm text-base">이름</span>
      <div class="flex items-center gap-1">
        <span class="text-sm text-base">{{ influencerStore.name }}</span>
        <img
          :src="Icon"
          alt=">"
          class="w-3 h-3 rotate-180 ml-2 cursor-pointer"
          @click="goToEditName"
        />
      </div>
    </div>

    <!-- 카테고리 -->
    <div class="flex items-center justify-between">
      <span class="text-sm text-base">카테고리</span>
      <div class="flex items-center gap-1">
        <span class="text-sm text-base">{{ influencerStore.category }}</span>
        <img
          :src="Icon"
          alt=">"
          class="w-3 h-3 rotate-180 ml-2 cursor-pointer"
          @click="goToEditCategory"
        />
      </div>
    </div>

    <!-- 소개글 -->
    <div>
      <div class="flex justify-between items-start mb-4">
        <span class="text-sm text-base">소개글</span>
        <img :src="Icon" alt=">" class="w-3 h-3 rotate-180 cursor-pointer" @click="goToEditIntro" />
      </div>
      <div
        class="border border-subtle-border rounded-lg px-4 py-3 text-sm text-text-base h-36"
      >
        {{ influencerStore.description || '소개글이 없습니다.' }}
      </div>
    </div>
  </div>
</template>
