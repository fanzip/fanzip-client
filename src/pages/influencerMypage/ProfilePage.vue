<script setup>
import ProfileFanCard from '@/components/influencerMypage/profile/ProfileFanCard.vue';
import ProfileImage from '@/components/influencerMypage/profile/ProfileImage.vue';
import ProfileMenu from '@/components/influencerMypage/profile/ProfileMenu.vue';
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <ProfileImage/>
    <ProfileMenu/>
    <ProfileFanCard/>
  </div>
</template>
