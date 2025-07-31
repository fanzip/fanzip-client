<script setup>
import { ref } from 'vue'

import BackHeader from '@/components/membership/BackHeader.vue'
import MembershipProfile from '@/components/membership/MembershipProfile.vue'
import MembershipTier from '@/components/membership/MembershipTier.vue'
import MembershipTierSelect from '@/components/membership/MembershipTierSelect.vue'
import BasePaymentOption from '@/components/common/BasePaymentOption.vue'

const selectedTier = ref('vip') // 선택된 등급
const selectedPayment = ref('kb') // 선택된 결제 수단
</script>

<template>
  <div class="bg-[#F6F6F6] min-h-screen">
    <BackHeader />
    <MembershipProfile />

    <div class="px-4 py-4">
      <div class="bg-white rounded-xl shadow p-4">
        <MembershipTier />
      </div>
      <div class="bg-white rounded-xl shadow p-4 mt-5">
        <MembershipTierSelect v-model="selectedTier" />
      </div>
      <div class="bg-white rounded-xl shadow p-4 mt-5">
        <BasePaymentOption v-model="selectedPayment" />
      </div>
    </div>
  </div>
</template>
