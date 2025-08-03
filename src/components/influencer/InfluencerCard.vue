<script setup>
import { useRouter } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'

const props = defineProps({
  id: Number,
  name: String,
  profileImage: String,
  coverImage: String,
  description: String,
})

const router = useRouter()

const influencerStore = useInfluencerStore()
const goToMembershipSelect = () => {
  // Pinia에 저장
  influencerStore.setInfluencer({
    id: props.id,
    name: props.name,
    profileImage: props.profileImage,
    coverImage: props.coverImage,
    description: props.description,
  })

  // 다음 페이지로 이동
  router.push('/membership/select')
}
</script>

<template>
  <div
    class="bg-white rounded-xl px-4 py-2 flex flex-col items-center w-[180px] shadow-sm"
    @click="goToMembershipSelect"
  >
    <!-- 프로필 이미지 -->
    <img
      :src="props.profileImage"
      :alt="props.name"
      class="w-[150px] h-[150px] rounded-lg object-cover border-[2px] border-transparent hover:cursor-pointer"
    />

    <!-- 이름 -->
    <p
      class="mt-2 px-5 py-[2px] text-sm font-medium rounded-[8px] border border-base-border text-center text-black hover: cursor-pointer"
    >
      {{ props.name }}
    </p>
  </div>
</template>
