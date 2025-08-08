<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'
import influencerApi from '@/api/influencerApi'

import AppHeader from '@/components/layout/AppHeader.vue'
import MembershipProfile from '@/components/membership/MembershipProfile.vue'
import MembershipTier from '@/components/membership/MembershipTier.vue'
import MembershipTierSelect from '@/components/membership/MembershipTierSelect.vue'
import BasePaymentOption from '@/components/common/BasePaymentOption.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const selectedTier = ref('VIP') // 초기값도 대문자로
const selectedPayment = ref('kb')

const route = useRoute()
const influencerStore = useInfluencerStore()

const influencerName = computed(() => influencerStore.name)
const profileImage   = computed(() => influencerStore.profileImage)
const description    = computed(() => influencerStore.description)

// ✅ 등급 리스트 상태
const grades = ref([])

// 비교 시 대소문자 무시, 표시 시 대문자
const selectedAmount = computed(() => {
  const found = grades.value.find(
    g => String(g.gradeName).toUpperCase() === selectedTier.value
  )
  return found ? found.monthlyAmount : 0
})

onMounted(async () => {
  try {
    const influencerId = route.params.influencerId

    const resp = await influencerApi.fetchDetail(influencerId)
    const data = resp?.data ?? resp
    console.log('🔥 detail data:', data)

    if (!data || !data.influencerName) {
      console.warn('⚠️ 유효하지 않은 인플루언서 응답입니다.')
      return
    }

    influencerStore.setInfluencer(data)

    grades.value = data.membershipGrades ?? data.grades ?? []
    console.log('grades set:', grades.value)

    // 로딩 후 초기 선택값도 대문자로
    if (grades.value.length) {
      selectedTier.value = String(grades.value[0].gradeName).toUpperCase()
    }
  } catch (e) {
    console.error('❌ 인플루언서 상세 조회 실패', e)
  }
})
</script>

<template>
  <div class="bg-subtle-bg min-h-screen">
    <AppHeader type="back" />

    <MembershipProfile
      class="mt-10"
      :name="influencerName"
      :image-url="profileImage"
      :description="description"
    />

    <div class="px-4 py-4">
      <div class="bg-base-bg rounded-xl shadow p-4">
        <MembershipTier />
      </div>

      <div class="bg-base-bg rounded-xl shadow p-4 mt-5">
        <MembershipTierSelect
          v-model:select-tier="selectedTier"
          :grades="grades"
        />
      </div>

      <div class="bg-base-bg rounded-xl shadow p-4 mt-5 mb-20">
        <BasePaymentOption v-model="selectedPayment" />
      </div>

      <nav
        class="fixed bottom-0 left-0 w-full h-20 bg-base-bg border-t border-nav-stroke rounded-t-2xl flex items-center justify-center z-50"
      >
        <BaseButton
          :variant="selectedPayment ? 'primary' : 'cancel'"
          size="lg"
          :disabled="!selectedPayment"
        >
          <span class="font-bold">{{ selectedAmount.toLocaleString() }} 원</span>
          <span class="font-bold">결제하기</span>
        </BaseButton>
      </nav>
    </div>
  </div>
</template>
