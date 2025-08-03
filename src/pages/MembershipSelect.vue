<script setup>
import { ref } from 'vue'
import { useInfluencerStore } from '@/stores/influencerStore'

import AppHeader from '@/components/layout/AppHeader.vue'
import MembershipProfile from '@/components/membership/MembershipProfile.vue'
import MembershipTier from '@/components/membership/MembershipTier.vue'
import MembershipTierSelect from '@/components/membership/MembershipTierSelect.vue'
import BasePaymentOption from '@/components/common/BasePaymentOption.vue'

const selectedTier = ref('vip') // 선택된 등급
const selectedPayment = ref('kb') // 선택된 결제 수단

const influencerStore = useInfluencerStore()
const influencerName = influencerStore.name
const profileImage = influencerStore.profileImage
const coverImage = influencerStore.coverImage
const description = influencerStore.description
</script>

<template>
  <div class="bg-subtle-bg min-h-screen">
    <AppHeader type="back" />
    <MembershipProfile
      class="mt-10"
      :name="influencerName"
      :image-url="profileImage"
      :cover-image="coverImage"
      :description="description"
    />

    <div class="px-4 py-4">
      <div class="bg-base-bg rounded-xl shadow p-4">
        <MembershipTier />
      </div>
      <div class="bg-base-bg rounded-xl shadow p-4 mt-5">
        <MembershipTierSelect v-model="selectedTier" />
      </div>
      <div class="bg-base-bg rounded-xl shadow p-4 mt-5">
        <BasePaymentOption v-model="selectedPayment" />
      </div>
    </div>
  </div>
</template>
