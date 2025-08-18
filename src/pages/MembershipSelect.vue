<script setup>
/**
 * 멤버십 선택 → 결제 요청 페이지 이동
 * 변경점 요약
 * - subscribeMembership 응답에서 membershipId/paymentId/amount를 받아서
 *   공통 결제 페이지(PaymentPage)가 읽을 수 있도록 쿼리로 넘김
 *   ?paymentType=MEMBERSHIP&membershipId=...&paymentId=...&amount=...
 * - 금액은 반드시 서버가 내려준 값을 우선 사용 (UI 표시 금액과 불일치 방지)
 */

import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'
import influencerApi from '@/api/influencerApi'
import { subscribeMembership } from '@/api/membershipApi'

import AppHeader from '@/components/layout/AppHeader.vue'
import MembershipProfile from '@/components/membership/MembershipProfile.vue'
import MembershipTier from '@/components/membership/MembershipTier.vue'
import MembershipTierSelect from '@/components/membership/MembershipTierSelect.vue'
import BasePaymentOption from '@/components/common/BasePaymentOption.vue'
import BaseButton from '@/components/common/BaseButton.vue'

// 결제수단(공통 컴포넌트 규약 유지)
const selectedTier = ref('VIP') // 대문자 비교용
const selectedPayment = ref('kb')

const route = useRoute()
const router = useRouter()
const influencerStore = useInfluencerStore()

// 인플루언서 정보
const influencerName = computed(() => influencerStore.name)
const profileImage = computed(() => influencerStore.profileImage)
const description = computed(() => influencerStore.description)

// 등급 리스트
const grades = ref([])

/** 현재 선택된 등급의 금액 (표시용) */
const selectedAmount = computed(() => {
  const found = grades.value.find((g) => String(g.gradeName).toUpperCase() === selectedTier.value)
  return found ? found.monthlyAmount : 0
})

/** 현재 선택된 등급의 gradeId */
const selectedGradeId = computed(() => {
  const found = grades.value.find((g) => String(g.gradeName).toUpperCase() === selectedTier.value)
  return found ? found.gradeId : null
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

    if (grades.value.length) {
      selectedTier.value = String(grades.value[0].gradeName).toUpperCase()
    }
  } catch (e) {
    console.error('❌ 인플루언서 상세 조회 실패', e)
  }
})

/**
 * 결제 버튼 클릭
 * 1) 백엔드에 멤버십 구독(결제 준비) 요청
 * 2) 공통 결제 페이지(PaymentPage)로 이동하면서 필요한 식별자/금액을 쿼리로 전달
 *    - paymentType=MEMBERSHIP
 *    - membershipId
 *    - paymentId
 *    - amount(서버 응답 금액)
 */
const goToPayment = async () => {
  if (!selectedPayment.value) return
  if (!selectedGradeId.value) {
    alert('등급을 선택해 주세요.')
    return
  }

  try {
    // 1) 백엔드에 멤버십 구독(결제 준비) 요청
    const res = await subscribeMembership({
      influencerId: Number(route.params.influencerId),
      gradeId: selectedGradeId.value,
      autoRenewal: true,
      monthlyAmount: selectedAmount.value, // 서버가 최종 검증
      payMethod: 'TOSSPAY',
    })

    // ✅ 백엔드 응답에서 필요한 값
    const paymentId = res.paymentId
    const amount = res.monthlyAmount ?? res.amount ?? selectedAmount.value

    if (!paymentId) {
      console.error('❌ paymentId 누락:', res)
      alert('결제 준비에 실패했어요. 다시 시도해 주세요.')
      return
    }

    // 2) 공통 PaymentPage의 "재사용 분기"를 강제로 태움
    //    (조건: route.query.paymentId && paymentType === 'MEMBERSHIP')
    router.push({
      name: 'PaymentPage', // == '/payments/request'
      query: {
        paymentType: 'MEMBERSHIP', // 🔴 수정: 멤버십 결제
        paymentId: String(paymentId), // 🔴 중요: 기존 payment 재사용
        amount: String(amount), // PaymentPage가 표시/요청에 사용
      },
    })
  } catch (e) {
    console.error('구독 신청 실패:', e)
    alert(e?.response?.data?.message ?? '구독 신청에 실패했어요.')
  }
}
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
        <MembershipTierSelect v-model:select-tier="selectedTier" :grades="grades" />
      </div>

      <div class="bg-base-bg rounded-xl shadow p-4 mt-5 mb-20">
        <BasePaymentOption v-model="selectedPayment" />
      </div>

      <!-- 하단 고정 결제 버튼 -->
      <nav
        class="fixed bottom-0 left-0 w-full h-20 bg-base-bg border-t border-nav-stroke rounded-t-2xl flex items-center justify-center z-50"
      >
        <BaseButton
          :variant="selectedPayment ? 'primary' : 'cancel'"
          size="lg"
          :disabled="!selectedPayment"
          @click="goToPayment"
        >
          <span class="font-bold">{{ selectedAmount.toLocaleString() }}원</span>
          <span class="font-bold">결제하기</span>
        </BaseButton>
      </nav>
    </div>
  </div>
</template>
