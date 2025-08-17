<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  id: Number,
  name: String,
  profileImage: String,
  description: String,
})

const router = useRouter()

const goToMembershipSelect = () => {
  // 다음 페이지로 이동
  router.push(`/membership/select/${props.id}`)
}
</script>

<template>
  <div
    class="bg-white rounded-xl px-4 py-2 flex flex-col items-center w-full shadow-sm"
    @click="goToMembershipSelect"
  >
    <!-- 프로필 이미지 -->
    <div class="w-full aspect-square rounded-lg overflow-hidden bg-subtle-bg">
      <img
        :src="props.profileImage"
        :alt="props.name"
        class="w-full h-full object-cover hover: cursor-pointer"
      />
    </div>

    <!-- 이름 -->
    <p
      class="mt-2 px-5 py-[2px] text-sm font-medium rounded-lg border border-base-border text-center text-black hover: cursor-pointer"
    >
      {{ props.name }}
    </p>
  </div>
</template>
