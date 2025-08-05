<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import NameEdit from '@/components/influencerMypage/edit/NameEdit.vue'
import { useInfluencerStore } from '@/stores/influencerStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const influencerStore = useInfluencerStore()
const name = ref(influencerStore.name)

const handleSave = () => {
  influencerStore.updateName(name.value)
  router.back()
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <NameEdit v-model="name" class="pt-20 px-6" />

    <div class="pt-10 px-6 flex justify-center">
      <BaseButton variant="primary" size="lg">
        <span class="font-semibold" @click="handleSave">완료</span>
      </BaseButton>
    </div>
  </div>
</template>
